import { Pipe, PipeTransform } from '@angular/core';
import {Networks} from "../models";

@Pipe({
  name: 'networkInfo'
})
export class NetworkInfoPipe implements PipeTransform {

  transform(selectedNetwork: Networks | string, type: 'logo' | 'scan' | 'name'): string {

    switch (selectedNetwork){
      case Networks.Binance:
        if (type === 'name'){
          return 'Binance';
        }
        return type === 'logo'
          ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
          : 'https://bscscan.com/tx';

      case Networks.Polygon:
        if (type === 'name'){
          return 'Polygon';
        }
        return type === 'logo'
          ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
          : 'https://polygonscan.com/tx';

      case Networks.Ethereum:
        if (type === 'name'){
          return 'Ethereum';
        }
        return type === 'logo'
          ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
          : 'https://etherscan.io/tx';

      case Networks.Solana:
        if (type === 'name'){
          return 'Solana';
        }
        return type === 'logo'
          ? 'https://solana.com/branding/new/exchange/exchange-sq-white.png'
          : '#';
      default:
        return '';
    }
  }

}
