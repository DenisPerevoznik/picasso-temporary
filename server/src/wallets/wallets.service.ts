import {Injectable} from "@nestjs/common";
import {GetWalletDto} from "./dto/get-wallet.dto";
import {HttpService} from "@nestjs/axios";
import {forkJoin, map, mergeMap, Observable} from "rxjs";
import {Token} from "./models/token.model";
import {HelperService} from "../shared/services/helper.service";
import {GetTransactionsDto} from "./dto/get-transactions.dto";
import {Transaction} from "./models/transaction.model";

const UNMARSHAL_URL = 'https://stg-api.unmarshal.io/v1';
const UNMARSHAL_API_KEY = 'VGVtcEtleQ%3D%3D';
const STATISTIC_COINS_URL = 'https://api.coingecko.com/api/v3';
const GET_COINS_URL = `${STATISTIC_COINS_URL}/coins/list?include_platform=true`;
const EMPTY_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

@Injectable()
export class WalletsService {

    constructor(
        private httpService: HttpService,
        private helper: HelperService
    ){}

    getTokens(walletsData: GetWalletDto): Observable<Token[]>{

        const getBalanceUrl = this.getBalancesUrl(walletsData);
        return forkJoin({
            balancesData: this.httpService.get(getBalanceUrl).pipe(map(res => res.data)),
            allCoinsData: this.httpService.get(GET_COINS_URL).pipe(map(res => res.data))
        })
            .pipe(mergeMap(({balancesData, allCoinsData}) => {
                const balancesObject = {};
                const coinsIds = balancesData
                    .map(item => {
                        if (item.contract_ticker_symbol === 'BNB'){
                            return {...item, contract_address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'}
                        }

                        if (walletsData.chain === 'ethereum' && item.contract_ticker_symbol === 'ETH'){
                            return {...item, contract_address: null, unknownId: 'ethereum'}
                        }

                        return item;
                    })
                    .filter(item => item.contract_address !== EMPTY_ADDRESS)
                    .map(item => {

                        let key = 'binance-smart-chain';
                        switch (walletsData.chain){

                            case 'bsc':
                                key = 'binance-smart-chain';
                                break;

                            case 'ethereum':
                                key = 'ethereum';
                                break;

                            case 'matic':
                                key = 'polygon-pos';
                                break;
                        }

                        const found = allCoinsData.find(coin => !!coin.platforms[key]
                            && coin.platforms[key] === item.contract_address);

                        if(!!found || item.unknownId){
                            const id = !!found ? found.id : item.unknownId;
                            balancesObject[id] = {
                                address: item.contract_address,
                                balance: this.calculateBalance(item.balance, item.contract_decimals)
                            };
                            return id.toString();
                        }
                    });

                const tokensString = coinsIds.join(',');
                return this.httpService.get(this.getCoinsStatisticUrl(tokensString))
                    .pipe(
                        map(response => response.data),
                        map(coinsData => {
                            return coinsData.map(coin => ({
                                balance: this.helper.trimAfterDecimal(balancesObject[coin.id].balance, 4),
                                contractAddress: balancesObject[coin.id].address,
                                logoUrl: coin.image,
                                symbol: coin.symbol.toUpperCase(),
                                name: coin.name,
                                pricePercentage24h: this.helper.trimAfterDecimal(coin.price_change_percentage_24h),
                                pricePercentage7d: this.helper.trimAfterDecimal(coin.price_change_percentage_7d_in_currency),
                                sum: this.helper.trimAfterDecimal(coin.current_price * balancesObject[coin.id].balance, 4),
                                currentPrice: this.helper.trimAfterDecimal(coin.current_price),
                            }))
                        })
                    )
            }));
    }

    getTransactions(data: GetTransactionsDto): Observable<Transaction[]>{

        return this.httpService.get(`${UNMARSHAL_URL}/${data.chain}/address/${data.walletAddress}/transactions?auth_key=VGVtcEtleQ%3D%3D&page=1&contract=${data.contractAddress}`)
            .pipe(
                map(response => response.data.transactions),
                map(transactions => {
                    if(!transactions || (transactions && !transactions.length)){
                        return [];
                    }
                    return transactions
                        .map(trs => ({
                            id: trs.id,
                            from: trs.from,
                            to: trs.to,
                            date: new Date(trs.date * 1000),
                            status: trs.status,
                            type: trs.type.charAt(0).toUpperCase() + trs.type.substring(1),
                            description: trs.description
                        }));
                })
            );
    }

    private getBalancesUrl(data: GetWalletDto){
        return `${UNMARSHAL_URL}/${data.chain}/address/${data.walletAddress}/assets?auth_key=${UNMARSHAL_API_KEY}`;
    }

    private getCoinsStatisticUrl(tokens: string){
        return `${STATISTIC_COINS_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d&ids=${tokens}`;
    }

    private calculateBalance(receivedBalance: string | number, contractDecimals: number){

        let value = (+receivedBalance / (10 ** contractDecimals)).toString();
        if (value.includes('e')){
            const eIndex = value.indexOf('e');
            value = value.substr(0, eIndex);
        }
        return parseFloat(value);
    }
}
