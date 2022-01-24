import {Injectable, Scope} from "@nestjs/common";

@Injectable({scope: Scope.DEFAULT})
export class HelperService{

    trimAfterDecimal(value: number, countAfterDecimal: number = 2){
        if(!value){
            return value;
        }

        const str = value.toString();

        if(str.indexOf('.') === -1){
            return value;
        }
        const split = str.split('.');
        return +(`${split[0]}.${split[1].substr(0, countAfterDecimal)}`);
    }

    getChainData(chainId: string | number){
        switch (chainId){

            case 'bep':
            case 56:
                return {name: 'bsc', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'};
            case 137:
                return {name: 'matic', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'};
            case 1:
                return {name: 'ethereum', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'};
            default:
                return {name: 'unknown', image: '/assets/images/unknown.png'};
        }
    }

    getFixedDateString(date: Date, withTime = true){
        const monthNum = date.getMonth() + 1;
        const month = monthNum < 10 ? `0${monthNum}` : monthNum;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${day}.${month}.${date.getFullYear()}` + (withTime ? ` ${hours}:${minutes}` : '');
    }

    getTime(date: Date){
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${hours}:${minutes}`;
    }
}
