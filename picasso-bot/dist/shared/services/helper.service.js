"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperService = void 0;
const common_1 = require("@nestjs/common");
let HelperService = class HelperService {
    trimAfterDecimal(value, countAfterDecimal = 2) {
        if (!value) {
            return value;
        }
        const str = value.toString();
        if (str.indexOf('.') === -1) {
            return value;
        }
        const split = str.split('.');
        return +(`${split[0]}.${split[1].substr(0, countAfterDecimal)}`);
    }
    getChainData(chainId) {
        switch (chainId) {
            case 'bep':
            case 56:
                return { name: 'bsc', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' };
            case 137:
                return { name: 'matic', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' };
            case 1:
                return { name: 'ethereum', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' };
            default:
                return { name: 'unknown', image: '/assets/images/unknown.png' };
        }
    }
    getFixedDateString(date, withTime = true) {
        const monthNum = date.getMonth() + 1;
        const month = monthNum < 10 ? `0${monthNum}` : monthNum;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${day}.${month}.${date.getFullYear()}` + (withTime ? ` ${hours}:${minutes}` : '');
    }
    getTime(date) {
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${hours}:${minutes}`;
    }
};
HelperService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.DEFAULT })
], HelperService);
exports.HelperService = HelperService;
//# sourceMappingURL=helper.service.js.map