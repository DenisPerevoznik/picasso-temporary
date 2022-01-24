import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {catchError, map, Observable, of} from "rxjs";
import {Pool} from "../entities/pool.entity";

@Injectable()
export class GamefiService {

    private readonly url = 'https://hub.gamefi.org/api/v1/pools/upcoming-pools?token_type=erc20&limit=50&page=1';
    constructor(
        private httpService: HttpService,
    ) {
    }

    getData(customUrl: string = null): Observable<Pool[]>{
        const url = customUrl ? customUrl : this.url;
        return this.httpService.get(url)
            .pipe(
                map(response => response.data.data.data),
                map(data => data.filter(item => !!item.start_time)),
                map(data => {

                    return data.map(item => {
                        let type = 'Private';
                        let infoTitle = 'Начало белого списка';

                        if (item.is_private === 3) {
                            type = 'Community';
                            infoTitle = 'Начало соревнования';
                        } else if (item.is_private === 0) {
                            type = 'Public';
                        }

                        let startJoinPoolTime = new Date(item.start_join_pool_time * 1000);
                        const endJoinPoolTime = new Date(item.end_join_pool_time * 1000);
                        let displayTime = startJoinPoolTime;
                        let calendarDateTime = startJoinPoolTime;
                        const currentDate = new Date();

                        if (startJoinPoolTime.getTime() < currentDate.getTime()) { // if time ended

                            infoTitle = 'Конец белого списка';
                            if (item.is_private === 3) {
                                infoTitle = 'Конец соревнования';
                            }
                            displayTime = endJoinPoolTime;
                        }

                        if (endJoinPoolTime.getTime() < currentDate.getTime()) {
                            infoTitle = 'Начало покупки';
                            displayTime = new Date(item.start_time * 1000);
                            calendarDateTime = new Date(item.start_time * 1000);
                        }

                        return {
                            id: item.id,
                            acceptCurrency: item.accept_currency,
                            banner: item.banner,
                            createdAt: item.created_at,
                            description: item.description,
                            network: item.network_available,
                            calendarDateTime,
                            displayTime,
                            infoTitle,
                            symbol: item.symbol,
                            title: item.title,
                            tokenImage: item.token_images,
                            projectWebsite: item.website,
                            url: `https://hub.gamefi.org/#/buy-token/${item.id}`,
                            type,
                            platformImage: 'https://hub.gamefi.org/images/partnerships/gamefi.png',
                            claimConfig: item.campaignClaimConfig,
                            sourceName: 'GameFi',
                            fields: [
                                {'Сумма обмена': `${item.total_sold_coin} ${item.symbol}`},
                                {[`1 ${item.symbol}`]: `${item.token_conversion_rate} BUSD`},
                            ],
                        }
                    });
                }),
                catchError(err => of([])),
            )
    }
}
