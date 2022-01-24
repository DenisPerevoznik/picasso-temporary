import {HttpService} from "@nestjs/axios";
import {catchError, map, Observable, of} from "rxjs";
import {Pool} from "../entities/pool.entity";
import {HelperService} from "../../shared/services/helper.service";
import {Injectable} from "@nestjs/common";
import {PoolServiceInterface} from "./pool.interface";

@Injectable()
export class BscLaunchService implements PoolServiceInterface{

    private readonly url = 'https://pun01s78i3.execute-api.ap-southeast-1.amazonaws.com/prod/pool?_sort=index:DESC&_limit=50&_start=0&categoryPool=ido';
    constructor(
        private httpService: HttpService,
        private helper: HelperService
    ) {
    }

    getData(): Observable<Pool[]>{
        return this.httpService.get(this.url)
            .pipe(
                map(response => response.data),
                map(data => data.filter(item => new Date().getTime() >= new Date(item.startDate).getTime())),
                map(data => {
                    return data.map(item => {
                        const name = item.name;
                        const symbol = item.tokenName;
                        const logo = item.logoUrl;
                        const website = item.ownerLink;

                        return {
                            acceptCurrency: null,
                            banner: logo,
                            createdAt: new Date(item.createdAt),
                            description: item.data.shortDescription,
                            network: this.helper.getChainData(item.chainId).name,
                            infoTitle: item.data.startDate && item.data.startDate !== 'TBA' ? 'Старт' : 'Заканчивается',
                            calendarDateTime: new Date(item.data.startDate && item.data.startDate !== 'TBA' ? item.data.startDate:
                                item.createdAt),
                            displayTime: new Date(item.data.startDate && item.data.startDate !== 'TBA' ? item.data.startDate :
                                item.startDate),
                            symbol,
                            title: name,
                            tokenImage: logo,
                            projectWebsite: website,
                            url: `https://app.bsclaunch.org/pool/${item.id}`,
                            type: item.type,
                            platformImage: 'https://app.bsclaunch.org/img/logo-with-name.dark.f0b3ddcf.svg',
                            sourceName: 'BSC Launch',
                            fields: [
                                {'Ratio': `${item.ratio}`}
                            ]
                        }
                    });
                }),
                catchError(err => of([])),
            )
    }
}
