import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {catchError, Observable, of} from "rxjs";
import {Pool} from "../entities/pool.entity";
import {map} from "rxjs/operators";

@Injectable()
export class SeedifyService {

    private readonly url = 'https://launchpad.seedify.fund/api/get_upcPool';
    constructor(
        private httpService: HttpService
    ) {
    }

    getData(): Observable<Pool[]>{

        return this.httpService.get(this.url)
            .pipe(
                map(response => response.data),
                map(responseData => {
                    const data: any = [...responseData.upcPool, ...responseData.featured];
                    return data
                        .filter((item: any) => new Date(parseInt(item.end_date)).getTime() >= new Date().getTime())
                        .map((item: any) => {

                            return {
                                acceptCurrency: null,
                                banner: item.images,
                                createdAt: new Date(item.createdAt),
                                description: item.content,
                                network: null,
                                infoTitle: "Старт",
                                calendarDateTime: new Date(+item.start_date),
                                displayTime: new Date(+item.end_date),
                                symbol: item.symbol,
                                title: item.title,
                                tokenImage: item.images,
                                projectWebsite: item.browser_web_link,
                                url: `https://launchpad.seedify.fund/pool_detail/upcomming/${item._id}`,
                                type: item.up_pool_access,
                                sourceName: 'Seedify',
                                platformImage: 'https://s2.coinmarketcap.com/static/img/coins/200x200/8972.png',
                                fields: [
                                    {'1 BUSD': `${item.up_pool_raise} ${item.symbol}`}
                                ],
                            }
                        });
                }),
                catchError(err => of([])),
            )
    }
}
