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
exports.TruepnlService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const helper_service_1 = require("../../shared/services/helper.service");
let TruepnlService = class TruepnlService {
    constructor(httpService, helper) {
        this.httpService = httpService;
        this.helper = helper;
        this.url = 'https://launchpad.truepnl.com/api/v1/project/list?depth=0';
    }
    getData() {
        return this.httpService.get(this.url)
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(data => data.filter(item => item.status !== 'claiming' && !item.status.startsWith('white'))), (0, rxjs_1.map)(data => data.map(item => ({
            banner: item.logo,
            createdAt: null,
            description: null,
            network: item.sale_network,
            infoTitle: 'Следующий статус',
            calendarDateTime: new Date(item.start_date),
            displayTime: item.next_status_date ? new Date(item.next_status_date) : null,
            symbol: item.name,
            title: item.name,
            tokenImage: item.logo,
            sourceName: 'Truepnl',
            fields: [
                { 'Мин. инвестиция': `${item.min_investment} ${item.payment_token}` },
                { 'Цена публичной продажи': `$${item.token_price}` },
                { 'Цена листинга': `$${item.public_price} (${this.helper.trimAfterDecimal(item.pt_change)}%)` }
            ],
            projectWebsite: '#',
            url: `https://launchpad.truepnl.com/whitelist_project/${item._id}`,
            type: item.type,
            platformImage: 'https://s2.coinmarketcap.com/static/img/coins/200x200/9605.png',
        }))), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
};
TruepnlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        helper_service_1.HelperService])
], TruepnlService);
exports.TruepnlService = TruepnlService;
//# sourceMappingURL=truepnl.service.js.map