import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Networks, Token, Transaction, Event, PoolData, ClaimConfig, PlatformIcons} from "../models";
import {environment} from "../../../environments/environment";
import * as CryptoJS from 'crypto-js';
import {map} from "rxjs/operators";

export const InterceptorSkip = 'X-Skip-Interceptor';
export const InterceptorSkipHeader = new HttpHeaders({
  'X-Skip-Interceptor': ''
});

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  private serverApi = environment.serverApi;
  private secretKey = 'crypt-1api-2picasso-3secret-4key';

  constructor(
    private http: HttpClient,
  ) { }

  getTokensOfWallet(walletAddress: string, chain: Networks): Observable<Token[]>{
    return this.http.post<Token[]>(`${this.serverApi}/wallets/get`, {
      walletAddress, chain
    });
  }

  getTransactionsOfToken(contractAddress: string, walletAddress: string, chain: Networks): Observable<Transaction[]>{
    return this.http.post<Transaction[]>(`${this.serverApi}/wallets/transactions`,
      {contractAddress, walletAddress, chain});
  }

  getEvents(year: string, month: string): Observable<Event[]>{
    return this.http.post<Event[]>(`${this.serverApi}/events/by-date`, {month, year})
      .pipe(
        map(events => events.map(item => {
          try {
            // @ts-ignore
            return {...item, icon: item.icon ? item.icon : PlatformIcons.Picasso, metadata: JSON.parse(item.metadata)};
          }
          catch(err) {
            return {...item, icon: item.icon ? item.icon : PlatformIcons.Picasso, metadata: []};
          }
        })));
  }

  createEvent(data: Event): Observable<Event> {
    const readyData = {...data, metadata: JSON.stringify(data.metadata)};
    return this.http.post<Event>(`${this.serverApi}/events`, readyData);
  }

  updateEvent(data: Event): Observable<Event> {
    const readyData = {...data, metadata: JSON.stringify(data.metadata)};
    return this.http.patch<Event>(`${this.serverApi}/events/${data.id}`, readyData);
  }

  removeEvent(id: string | number): Observable<Event> {
    return this.http.delete<Event>(`${this.serverApi}/events/${id}`);
  }

  getTokensCollection(): Observable<ClaimConfig[]>{
    return this.http.get<ClaimConfig[]>(`${this.serverApi}/claims/other-claims`)
      .pipe(map(data => {
        return data.map(item => {
          const chain = item.chain.toLowerCase();
          let chainImg = null;
          switch (chain){
            case 'bsc':
              chainImg = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png';
              break;
            case 'eth':
            case 'ethereum':
              chainImg = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png';
              break;
            case 'polygon':
              chainImg = 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png';
              break;
            case 'solana':
              chainImg = 'https://solana.com/branding/new/exchange/exchange-sq-white.png';
              break;
          }

          return {...item, chainImg}
        })
      }));
  }

  getOtherPools(): Observable<{[key: string]: PoolData[]}>{
    return this.http.get<{[key: string]: PoolData[]}>(`${this.serverApi}/events/other-pools`);
  }

  createClaims(claims: ClaimConfig[]): Observable<{message: string}>{
    return this.http.post<{message: string}>(`${this.serverApi}/create-claims`, {claimsArray: claims});
  }

  removeClaimsGroup(groupId: number): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${this.serverApi}/remove-claims-group/${groupId}`);
  }

  removeClaimItem(claimId: number): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${this.serverApi}/remove-claim/${claimId}`);
  }

  private decryptData(encryptedData: string){
    const bytes  = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}
