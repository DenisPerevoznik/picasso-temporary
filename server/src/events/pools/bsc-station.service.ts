import {Injectable} from "@nestjs/common";
import {catchError, map, Observable, of} from "rxjs";
import {Pool} from "../entities/pool.entity";
import {HttpService} from "@nestjs/axios";
import {response} from "express";
import {HelperService} from "../../shared/services/helper.service";

@Injectable()
export class BscStationService{

    private readonly url = 'https://api.bscstation.org/api/Ido/get_idos';

    constructor(
        private helper: HelperService,
        private httpService: HttpService
    ) {
    }

    getData(): Observable<Pool[]>{
        return this.httpService.post(this.url, {})
            .pipe(
                map(response => response.data.data),
                map(data => {
                    const items: Pool[] = [];
                    data.forEach(item => {
                        const name = item.name;
                        const symbol = item.symbol;
                        const logo = item.logoUrl;
                        const website = item.zkchaos;

                        item.idoDetails
                            .filter(pool => !!pool.socical.startIDO && new Date(pool.socical.startIDO).getTime() >= new Date().getTime())
                            .forEach(pool => {
                                const tokenPriceArr = pool.swapAmount.split('=');
                                items.push({
                                    id: pool.id,
                                    acceptCurrency: null,
                                    banner: logo,
                                    createdAt: new Date(pool.created),
                                    description: pool.description,
                                    network: this.helper.getChainData(pool.network).name,
                                    infoTitle: "Дата начала",
                                    calendarDateTime: new Date(pool.socical.startIDO),
                                    displayTime: new Date(pool.socical.startIDO),
                                    symbol,
                                    title: name,
                                    tokenImage: logo,
                                    projectWebsite: website,
                                    url: `https://bscstation.finance/#/launchpad/${pool.id}/${symbol}`,
                                    type: pool.round,
                                    platformImage: 'https://bscstation.finance/images/logo-default.png',
                                    sourceName: 'BSC Station',
                                    fields: [
                                        {'Total sale': `${pool.totalSale} ${symbol}`},
                                        {'Total raise': `${pool.totalRaise} ${symbol}`},
                                        {[`1 ${symbol}`]: tokenPriceArr[1]}
                                    ]
                                });
                            });
                    });
                    return items;
                }),
                catchError(err => of([])),
            )
    }
}
