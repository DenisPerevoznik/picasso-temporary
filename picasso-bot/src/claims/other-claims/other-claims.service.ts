import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {GamefiService} from "../../events/pools/gamefi.service";
import {RedKiteService} from "../../events/pools/red-kite.service";
import {catchError, forkJoin, map, mergeMap, Observable, of, pipe} from "rxjs";
import {Pool} from "../../events/entities/pool.entity";
import {Claim} from "../entities/claim.entity";

@Injectable()
export class OtherClaimsService{

    constructor(
        private httpService: HttpService,
        private gameFiService: GamefiService,
        private redKiteService: RedKiteService
    ) {
    }

    getSfundData(): Observable<Claim[]>{
        return this.httpService.get('https://combotools.online/api/index.php?mode=calendar')
            .pipe(
                map(response => response.data.vesting),
                map(data => data.map(item => ({...item, source: "Sfund", date: new Date(item.date)}))),
                catchError(err => of([]))
            );
    }

    getGameFiData(): Observable<Claim[]>{
        return this.gameFiService.getData()
            .pipe(map(data => {
                return this.getGameFiAndRedKiteClaims(data, 'GameFi');
            }),
                catchError(err => of([])))
    }

    getRedKiteData(): Observable<Claim[]>{
        return this.gameFiService.getData()
            .pipe(map(data => {
                return this.getGameFiAndRedKiteClaims(data, 'Red Kite');
            }),
                catchError(err => of([])))
    }

    private getGameFiAndRedKiteClaims(data: Pool[], sourceName: string){
        const claimArray = [];

        data.forEach(item => {
            claimArray
                .push(
                    ...item.claimConfig
                        .filter(claim => claim.start_time)
                        .filter(claim => this.gameFiAndRedKiteClaimFilterPredicate(claim))
                        .map(claim => ({
                            chain: item.network, date: new Date(claim.start_time * 1000),
                            token: item.symbol, percentage: claim.max_percent_claim, type: '', source: sourceName
                        }))
                );
        });
        return claimArray;
    }

    getCompletedRedKiteClaim(): Observable<Claim[]>{

        return this.httpService.get('https://redkite-api.polkafoundry.com/pools/v3/complete-sale-pools')
            .pipe(
                map(response => response.data.data.data),
                map(data => data.filter(item => item.start_time)),
                map(data => {
                    const array = [];
                    data.forEach(item => {
                        array.push(...item.campaignClaimConfig
                            .filter(claim => claim.start_time)
                            .filter(claim => this.gameFiAndRedKiteClaimFilterPredicate(claim))
                            .map(claim => ({
                                chain: item.network_available, date: new Date(claim.start_time * 1000),
                                token: item.symbol, percentage: claim.max_percent_claim, type: '', source: 'Red Kite'
                            })))
                    });
                    return array;
                }),
                catchError(err => of([]))
            )
    }

    getCompletedGameFiClaims(): Observable<Claim[]>{

        return this.gameFiService.getData('https://hub.gamefi.org/api/v1/pools/complete-sale-pools?token_type=erc20&limit=50&page=1')
            // @ts-ignore
            .pipe(mergeMap(gameFiData => {
                 const obsArray = gameFiData.map(item => this.httpService.get(`https://hub.gamefi.org/api/v1/pool/${item.id}`));
                 return forkJoin(...obsArray)
                     .pipe(
                         map(response => response.map(res => res.data.data)),
                         map(data => {
                             const array = [];
                             for (const responseItem of data) {
                                 array.push(
                                     ...responseItem.campaignClaimConfig
                                         .filter(claim => claim.start_time)
                                         .filter(claim => this.gameFiAndRedKiteClaimFilterPredicate(claim))
                                         .map(claim => ({
                                             chain: responseItem.network, date: new Date(claim.start_time * 1000),
                                             token: responseItem.symbol, percentage: claim.max_percent_claim, type: '', source: 'GameFi'
                                         }))
                                 );
                             }
                             return array;
                         }),
                         catchError(err => of([]))
                     );
             }))
    }

    private gameFiAndRedKiteClaimFilterPredicate(claim: any){
        const claimDate = new Date(claim.start_time * 1000);
        const claimCheckDate = claimDate.getMonth() + 'ee' + claimDate.getFullYear();
        const currentDate = new Date();
        let check;
        let currentMonthPlus1;
        let currentMonthPlus2;

        check = currentDate.getMonth() === 11
            ? new Date(currentDate.getFullYear() + 1, 0, 1)
            : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        currentMonthPlus1 = check.getMonth() + check.getFullYear();

        if (currentDate.getMonth() === 10){
            check = new Date(currentDate.getFullYear() + 1, 0, 1);
            currentMonthPlus2 = check.getMonth() + 'ee' + check.getFullYear();
        }
        else if (currentDate.getMonth() === 11) {
            check = new Date(currentDate.getFullYear() + 1, 1, 1);
            currentMonthPlus2 = check.getMonth() + 'ee' + check.getFullYear();
        }
        else {
            check = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
            currentMonthPlus2 = check.getMonth() + 'ee' + check.getFullYear();
        }

        return claimCheckDate === (currentDate.getMonth() + 'ee' + currentDate.getFullYear()) || claimCheckDate === currentMonthPlus1
            || claimCheckDate === currentMonthPlus2;
    }
}
