"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolzFinanceService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const helper_service_1 = require("../../shared/services/helper.service");
let PoolzFinanceService = class PoolzFinanceService {
    constructor(httpService, helper) {
        this.httpService = httpService;
        this.helper = helper;
        this.url = 'https://admin.poolz.finance/poolz-idos';
    }
    getData() {
        return this.httpService.get(this.url)
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(data => data.filter(item => new Date(item.finishTime).getTime() >= new Date().getTime())), (0, rxjs_1.map)(data => {
            return data.map(item => {
                const assetsUrl = 'https://admin.poolz.finance';
                const symbolParse = item.details.tokenInformation
                    .filter(el => el.name)
                    .find(el => el.name.startsWith('Symbol'));
                const tokenRateParse = item.details.poolInformation.find(el => el.name === 'Token Price');
                const website = item.details.links.find(el => el.name === 'Website');
                const type = item.details.poolInformation.find(el => el.name === 'Access Type');
                const symbol = !!symbolParse ? symbolParse.url : '';
                const tokenRate = !!tokenRateParse ? tokenRateParse.url : null;
                return {
                    acceptCurrency: null,
                    banner: `${assetsUrl}/${item.icon.url}`,
                    createdAt: new Date(item.created_at),
                    description: item.details.text,
                    network: this.helper.getChainData(item.chainId).name,
                    infoTitle: "Заканчивается",
                    calendarDateTime: new Date(item.startTime),
                    displayTime: new Date(item.finishTime),
                    symbol,
                    title: item.name,
                    tokenImage: `${assetsUrl}/${item.icon.url}`,
                    projectWebsite: !!website ? website.url : '#',
                    url: `https://poolz.finance/detail/about?id=${item.id}`,
                    type: !!type ? type.url : 'TBA',
                    platformImage: 'https://poolz.finance/static/media/new-logo.667bf972.svg',
                    sourceName: 'Poolz Finance',
                    fields: [
                        { 'Общий объем': `${item.totalRaise}` },
                        { [`1 ${symbol}`]: tokenRate ? (`${tokenRate} BUSD`) : 'TBA' }
                    ],
                };
            });
        }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
};
PoolzFinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        helper_service_1.HelperService])
], PoolzFinanceService);
exports.PoolzFinanceService = PoolzFinanceService;
//# sourceMappingURL=poolz-finance.service.js.map