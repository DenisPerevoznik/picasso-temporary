import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ClaimConfig, Networks, PoolData} from "../models";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {HelpService} from "./help.service";
import {InterceptorSkipHeader} from "./apis.service";

@Injectable({
  providedIn: 'root'
})
export class PoolsService {

  private krystalGoUrl = 'https://launchpad-api.krystal.app/v1/pools';
  private seedifyFundUrl = 'https://launchpad.seedify.fund/api/get_upcPool?page=undefined';

  constructor(
    private http: HttpClient,
    private help: HelpService
  ) { }

  getKrystalGoData(getClaimData = false): Observable<PoolData[] | ClaimConfig[]>{

    // return this.http.get(this.krystalGoUrl, {headers : InterceptorSkipHeader})
    return this.http.get(this.krystalGoUrl)
      .pipe(map((data: any) => {

        if (getClaimData){
          const claimData: ClaimConfig[] = [];
          data.pools
            .forEach((item: any) => {

              const token = item.saleTokens[0].token;
              const chain = this.getChainData(item.chainId);
              const data = item.vestingPhases.map((claim: any) => ({
                chain: chain.name,
                date: new Date(claim.start * 1000),
                percentage: claim.percentage,
                token: token.symbol,
                type: item.access,
                source: 'KrystalGO',
                chainImg: chain.image
              }))
              claimData.push(...data);
            });

          return claimData;
        }

        return data.pools
          .filter((item: any) => new Date(item.whitelistEnd * 1000).getTime() >= new Date().getTime()
            && item.saleTokens && item.saleTokens.length)
          .map((item: any) => {
            const salesToken = item.saleTokens[0].token;
            const raiseToken = item.raiseTokens && item.raiseTokens.length ? item.raiseTokens[0].token : null;

            const totalSales = this.help.trimAfterDecimalPoint(
              this.calculateBalance(item.saleTokens[0].amount, salesToken.decimals));

            const totalRaise = raiseToken ? this.help.trimAfterDecimalPoint(
              this.calculateBalance(item.raiseTokens[0].amount, raiseToken.decimals)) : null;
            return {
              acceptCurrency: null,
              banner: item.project.banner,
              createdAt: null,
              description: item.project.description,
              network: 'bsc',
              infoTitle: "Конец белого списка",
              calendarDateTime: new Date(item.whitelistStart * 1000),
              displayTime: new Date(item.whitelistEnd * 1000),
              symbol: salesToken.symbol,
              title: item.name,
              tokenImage: salesToken.logo,
              projectWebsite: item.project.website,
              url: `https://go.krystal.app/projects/${item.id}`,
              type: item.access,
              platformImage: 'https://go.krystal.app/static/media/krystal.e6667918.svg',
              fields: [
                {'Total raise': totalRaise ? `${totalRaise} ${raiseToken.symbol}` : 'TBA'},
                {'Total sales': `${totalSales} ${salesToken.symbol}`},
              ],
            }
          });
      }));
  }

  private calculateBalance(receivedBalance: string | number, contractDecimals: number){
    let value = (+receivedBalance / (10 ** contractDecimals)).toString();
    if (value.includes('e')){
      const eIndex = value.indexOf('e');
      value = value.substr(0, eIndex);
    }
    return Math.round(parseFloat(value));
  }

  private getChainData(chainId: number): {name: string, image: string}{

    switch (chainId){

      case 56:
        return {name: Networks.Binance, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'};
      case 137:
        return {name: Networks.Polygon, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'};
      case 1:
        return {name: Networks.Ethereum, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'};
      default:
        return {name: 'unknown', image: '/assets/images/unknown.png'};
    }
  }
}
