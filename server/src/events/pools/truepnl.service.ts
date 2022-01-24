import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {catchError, map, Observable, of} from "rxjs";
import {Pool} from "../entities/pool.entity";
import {HelperService} from "../../shared/services/helper.service";

@Injectable()
export class TruepnlService{

    private readonly url = 'https://launchpad.truepnl.com/api/v1/project/list?depth=0';

    constructor(
        private httpService: HttpService,
        private helper: HelperService
    ) {
    }

    getData(): Observable<Pool[]>{
        return this.httpService.get(this.url)
            .pipe(
                map(response => response.data),
                map(data => data.filter(item => item.status !== 'claiming' && !item.status.startsWith('white'))),
                map(data => data.map(item => ({
                    banner: item.logo,
                    createdAt: null,
                    description: null,
                    network: item.sale_network,
                    infoTitle: 'Следующий статус',
                    calendarDateTime: new Date(item.start_date),
                    displayTime: item.next_status_date ? new Date(item.next_status_date) : null,
                    symbol: item.name,
                    title: item.name,
                    tokenImage: item.logo,
                    sourceName: 'Truepnl',
                    fields: [
                        {'Мин. инвестиция': `${item.min_investment} ${item.payment_token}`},
                        {'Цена публичной продажи': `$${item.token_price}`},
                        {'Цена листинга': `$${item.public_price} (${this.helper.trimAfterDecimal(item.pt_change)}%)`}
                    ],
                    projectWebsite: '#',
                    url: `https://launchpad.truepnl.com/whitelist_project/${item._id}`,
                    type: item.type,
                    platformImage: 'https://s2.coinmarketcap.com/static/img/coins/200x200/9605.png',
                }))),
                catchError(err => of([])),
            )
    }
}
