import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {catchError, map, Observable, of} from "rxjs";
import {Pool} from "../entities/pool.entity";
import {HelperService} from "../../shared/services/helper.service";

@Injectable()
export class PoolzFinanceService{

    private readonly url = 'https://admin.poolz.finance/poolz-idos';
    constructor(
        private httpService: HttpService,
        private helper: HelperService
    ) {
    }

    getData(): Observable<Pool[]>{
        return this.httpService.get(this.url)
            .pipe(
                map(response => response.data),
                map(data => data.filter(item => new Date(item.finishTime).getTime() >= new Date().getTime())),
                map(data => {
                    return data.map(item => {
                        const assetsUrl = 'https://admin.poolz.finance';
                        const symbolParse = item.details.tokenInformation
                            .filter(el => el.name)
                            .find(el => el.name.startsWith('Symbol'));
                        const tokenRateParse = item.details.poolInformation.find(el => el.name === 'Token Price');
                        const website = item.details.links.find(el => el.name === 'Website');
                        const type = item.details.poolInformation.find(el => el.name === 'Access Type');
                        const symbol = !!symbolParse ? symbolParse.url : '';
                        const tokenRate = !!tokenRateParse ? tokenRateParse.url : null;
                        return {
                            acceptCurrency: null,
                            banner: `${assetsUrl}/${item.icon.url}`,
                            createdAt: new Date(item.created_at),
                            description: item.details.text,
                            network: this.helper.getChainData(item.chainId).name,
                            infoTitle: "Заканчивается",
                            calendarDateTime: new Date(item.startTime),
                            displayTime: new Date(item.finishTime),
                            symbol,
                            title: item.name,
                            tokenImage: `${assetsUrl}/${item.icon.url}`,
                            projectWebsite: !!website ? website.url : '#',
                            url: `https://poolz.finance/detail/about?id=${item.id}`,
                            type: !!type ? type.url : 'TBA',
                            platformImage: 'https://poolz.finance/static/media/new-logo.667bf972.svg',
                            sourceName: 'Poolz Finance',
                            fields: [
                                {'Общий объем': `${item.totalRaise}`},
                                {[`1 ${symbol}`]: tokenRate ? (`${tokenRate} BUSD`) : 'TBA'}
                            ],
                        }
                    });
                }),
                catchError(err => of([])),
            );
    }
}
