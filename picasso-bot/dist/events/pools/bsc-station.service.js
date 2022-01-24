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
exports.BscStationService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
const helper_service_1 = require("../../shared/services/helper.service");
let BscStationService = class BscStationService {
    constructor(helper, httpService) {
        this.helper = helper;
        this.httpService = httpService;
        this.url = 'https://api.bscstation.org/api/Ido/get_idos';
    }
    getData() {
        return this.httpService.post(this.url, {})
            .pipe((0, rxjs_1.map)(response => response.data.data), (0, rxjs_1.map)(data => {
            const items = [];
            data.forEach(item => {
                const name = item.name;
                const symbol = item.symbol;
                const logo = item.logoUrl;
                const website = item.zkchaos;
                item.idoDetails
                    .filter(pool => !!pool.socical.startIDO && new Date(pool.socical.startIDO).getTime() >= new Date().getTime())
                    .forEach(pool => {
                    const tokenPriceArr = pool.swapAmount.split('=');
                    items.push({
                        id: pool.id,
                        acceptCurrency: null,
                        banner: logo,
                        createdAt: new Date(pool.created),
                        description: pool.description,
                        network: this.helper.getChainData(pool.network).name,
                        infoTitle: "Дата начала",
                        calendarDateTime: new Date(pool.socical.startIDO),
                        displayTime: new Date(pool.socical.startIDO),
                        symbol,
                        title: name,
                        tokenImage: logo,
                        projectWebsite: website,
                        url: `https://bscstation.finance/#/launchpad/${pool.id}/${symbol}`,
                        type: pool.round,
                        platformImage: 'https://bscstation.finance/images/logo-default.png',
                        sourceName: 'BSC Station',
                        fields: [
                            { 'Total sale': `${pool.totalSale} ${symbol}` },
                            { 'Total raise': `${pool.totalRaise} ${symbol}` },
                            { [`1 ${symbol}`]: tokenPriceArr[1] }
                        ]
                    });
                });
            });
            return items;
        }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
};
BscStationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_1.HelperService,
        axios_1.HttpService])
], BscStationService);
exports.BscStationService = BscStationService;
//# sourceMappingURL=bsc-station.service.js.map