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
exports.GamefiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let GamefiService = class GamefiService {
    constructor(httpService) {
        this.httpService = httpService;
        this.url = 'https://hub.gamefi.org/api/v1/pools/upcoming-pools?token_type=erc20&limit=50&page=1';
    }
    getData(customUrl = null) {
        const url = customUrl ? customUrl : this.url;
        return this.httpService.get(url)
            .pipe((0, rxjs_1.map)(response => response.data.data.data), (0, rxjs_1.map)(data => data.filter(item => !!item.start_time)), (0, rxjs_1.map)(data => {
            return data.map(item => {
                let type = 'Private';
                let infoTitle = 'Начало белого списка';
                if (item.is_private === 3) {
                    type = 'Community';
                    infoTitle = 'Начало соревнования';
                }
                else if (item.is_private === 0) {
                    type = 'Public';
                }
                let startJoinPoolTime = new Date(item.start_join_pool_time * 1000);
                const endJoinPoolTime = new Date(item.end_join_pool_time * 1000);
                let displayTime = startJoinPoolTime;
                let calendarDateTime = startJoinPoolTime;
                const currentDate = new Date();
                if (startJoinPoolTime.getTime() < currentDate.getTime()) {
                    infoTitle = 'Конец белого списка';
                    if (item.is_private === 3) {
                        infoTitle = 'Конец соревнования';
                    }
                    displayTime = endJoinPoolTime;
                }
                if (endJoinPoolTime.getTime() < currentDate.getTime()) {
                    infoTitle = 'Начало покупки';
                    displayTime = new Date(item.start_time * 1000);
                    calendarDateTime = new Date(item.start_time * 1000);
                }
                return {
                    id: item.id,
                    acceptCurrency: item.accept_currency,
                    banner: item.banner,
                    createdAt: item.created_at,
                    description: item.description,
                    network: item.network_available,
                    calendarDateTime,
                    displayTime,
                    infoTitle,
                    symbol: item.symbol,
                    title: item.title,
                    tokenImage: item.token_images,
                    projectWebsite: item.website,
                    url: `https://hub.gamefi.org/#/buy-token/${item.id}`,
                    type,
                    platformImage: 'https://hub.gamefi.org/images/partnerships/gamefi.png',
                    claimConfig: item.campaignClaimConfig,
                    sourceName: 'GameFi',
                    fields: [
                        { 'Сумма обмена': `${item.total_sold_coin} ${item.symbol}` },
                        { [`1 ${item.symbol}`]: `${item.token_conversion_rate} BUSD` },
                    ],
                };
            });
        }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
};
GamefiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GamefiService);
exports.GamefiService = GamefiService;
//# sourceMappingURL=gamefi.service.js.map