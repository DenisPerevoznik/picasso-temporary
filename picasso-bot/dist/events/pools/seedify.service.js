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
exports.SeedifyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let SeedifyService = class SeedifyService {
    constructor(httpService) {
        this.httpService = httpService;
        this.url = 'https://launchpad.seedify.fund/api/get_upcPool';
    }
    getData() {
        return this.httpService.get(this.url)
            .pipe((0, operators_1.map)(response => response.data), (0, operators_1.map)(responseData => {
            const data = [...responseData.upcPool, ...responseData.featured];
            return data
                .filter((item) => new Date(parseInt(item.end_date)).getTime() >= new Date().getTime())
                .map((item) => {
                return {
                    acceptCurrency: null,
                    banner: item.images,
                    createdAt: new Date(item.createdAt),
                    description: item.content,
                    network: null,
                    infoTitle: "Старт",
                    calendarDateTime: new Date(+item.start_date),
                    displayTime: new Date(+item.end_date),
                    symbol: item.symbol,
                    title: item.title,
                    tokenImage: item.images,
                    projectWebsite: item.browser_web_link,
                    url: `https://launchpad.seedify.fund/pool_detail/upcomming/${item._id}`,
                    type: item.up_pool_access,
                    sourceName: 'Seedify',
                    platformImage: 'https://s2.coinmarketcap.com/static/img/coins/200x200/8972.png',
                    fields: [
                        { '1 BUSD': `${item.up_pool_raise} ${item.symbol}` }
                    ],
                };
            });
        }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
};
SeedifyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SeedifyService);
exports.SeedifyService = SeedifyService;
//# sourceMappingURL=seedify.service.js.map