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
exports.BscLaunchService = void 0;
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const helper_service_1 = require("../../shared/services/helper.service");
const common_1 = require("@nestjs/common");
let BscLaunchService = class BscLaunchService {
    constructor(httpService, helper) {
        this.httpService = httpService;
        this.helper = helper;
        this.url = 'https://pun01s78i3.execute-api.ap-southeast-1.amazonaws.com/prod/pool?_sort=index:DESC&_limit=50&_start=0&categoryPool=ido';
    }
    getData() {
        return this.httpService.get(this.url)
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(data => data.filter(item => new Date().getTime() >= new Date(item.startDate).getTime())), (0, rxjs_1.map)(data => {
            return data.map(item => {
                const name = item.name;
                const symbol = item.tokenName;
                const logo = item.logoUrl;
                const website = item.ownerLink;
                return {
                    acceptCurrency: null,
                    banner: logo,
                    createdAt: new Date(item.createdAt),
                    description: item.data.shortDescription,
                    network: this.helper.getChainData(item.chainId).name,
                    infoTitle: item.data.startDate && item.data.startDate !== 'TBA' ? 'Старт' : 'Заканчивается',
                    calendarDateTime: new Date(item.data.startDate && item.data.startDate !== 'TBA' ? item.data.startDate :
                        item.createdAt),
                    displayTime: new Date(item.data.startDate && item.data.startDate !== 'TBA' ? item.data.startDate :
                        item.startDate),
                    symbol,
                    title: name,
                    tokenImage: logo,
                    projectWebsite: website,
                    url: `https://app.bsclaunch.org/pool/${item.id}`,
                    type: item.type,
                    platformImage: 'https://app.bsclaunch.org/img/logo-with-name.dark.f0b3ddcf.svg',
                    sourceName: 'BSC Launch',
                    fields: [
                        { 'Ratio': `${item.ratio}` }
                    ]
                };
            });
        }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
};
BscLaunchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        helper_service_1.HelperService])
], BscLaunchService);
exports.BscLaunchService = BscLaunchService;
//# sourceMappingURL=bsc-launch.service.js.map