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
exports.OtherClaimsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const gamefi_service_1 = require("../../events/pools/gamefi.service");
const red_kite_service_1 = require("../../events/pools/red-kite.service");
const rxjs_1 = require("rxjs");
let OtherClaimsService = class OtherClaimsService {
    constructor(httpService, gameFiService, redKiteService) {
        this.httpService = httpService;
        this.gameFiService = gameFiService;
        this.redKiteService = redKiteService;
    }
    getSfundData() {
        return this.httpService.get('https://combotools.online/api/index.php?mode=calendar')
            .pipe((0, rxjs_1.map)(response => response.data.vesting), (0, rxjs_1.map)(data => data.map(item => (Object.assign(Object.assign({}, item), { source: "Sfund", date: new Date(item.date) })))), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
    getGameFiData() {
        return this.gameFiService.getData()
            .pipe((0, rxjs_1.map)(data => {
            return this.getGameFiAndRedKiteClaims(data, 'GameFi');
        }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
    getRedKiteData() {
        return this.gameFiService.getData()
            .pipe((0, rxjs_1.map)(data => {
            return this.getGameFiAndRedKiteClaims(data, 'Red Kite');
        }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
    getGameFiAndRedKiteClaims(data, sourceName) {
        const claimArray = [];
        data.forEach(item => {
            claimArray
                .push(...item.claimConfig
                .filter(claim => claim.start_time)
                .filter(claim => this.gameFiAndRedKiteClaimFilterPredicate(claim))
                .map(claim => ({
                chain: item.network, date: new Date(claim.start_time * 1000),
                token: item.symbol, percentage: claim.max_percent_claim, type: '', source: sourceName
            })));
        });
        return claimArray;
    }
    getCompletedRedKiteClaim() {
        return this.httpService.get('https://redkite-api.polkafoundry.com/pools/v3/complete-sale-pools')
            .pipe((0, rxjs_1.map)(response => response.data.data.data), (0, rxjs_1.map)(data => data.filter(item => item.start_time)), (0, rxjs_1.map)(data => {
            const array = [];
            data.forEach(item => {
                array.push(...item.campaignClaimConfig
                    .filter(claim => claim.start_time)
                    .filter(claim => this.gameFiAndRedKiteClaimFilterPredicate(claim))
                    .map(claim => ({
                    chain: item.network_available, date: new Date(claim.start_time * 1000),
                    token: item.symbol, percentage: claim.max_percent_claim, type: '', source: 'Red Kite'
                })));
            });
            return array;
        }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
    }
    getCompletedGameFiClaims() {
        return this.gameFiService.getData('https://hub.gamefi.org/api/v1/pools/complete-sale-pools?token_type=erc20&limit=50&page=1')
            .pipe((0, rxjs_1.mergeMap)(gameFiData => {
            const obsArray = gameFiData.map(item => this.httpService.get(`https://hub.gamefi.org/api/v1/pool/${item.id}`));
            return (0, rxjs_1.forkJoin)(...obsArray)
                .pipe((0, rxjs_1.map)(response => response.map(res => res.data.data)), (0, rxjs_1.map)(data => {
                const array = [];
                for (const responseItem of data) {
                    array.push(...responseItem.campaignClaimConfig
                        .filter(claim => claim.start_time)
                        .filter(claim => this.gameFiAndRedKiteClaimFilterPredicate(claim))
                        .map(claim => ({
                        chain: responseItem.network, date: new Date(claim.start_time * 1000),
                        token: responseItem.symbol, percentage: claim.max_percent_claim, type: '', source: 'GameFi'
                    })));
                }
                return array;
            }), (0, rxjs_1.catchError)(err => (0, rxjs_1.of)([])));
        }));
    }
    gameFiAndRedKiteClaimFilterPredicate(claim) {
        const claimDate = new Date(claim.start_time * 1000);
        const claimCheckDate = claimDate.getMonth() + 'ee' + claimDate.getFullYear();
        const currentDate = new Date();
        let check;
        let currentMonthPlus1;
        let currentMonthPlus2;
        check = currentDate.getMonth() === 11
            ? new Date(currentDate.getFullYear() + 1, 0, 1)
            : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        currentMonthPlus1 = check.getMonth() + check.getFullYear();
        if (currentDate.getMonth() === 10) {
            check = new Date(currentDate.getFullYear() + 1, 0, 1);
            currentMonthPlus2 = check.getMonth() + 'ee' + check.getFullYear();
        }
        else if (currentDate.getMonth() === 11) {
            check = new Date(currentDate.getFullYear() + 1, 1, 1);
            currentMonthPlus2 = check.getMonth() + 'ee' + check.getFullYear();
        }
        else {
            check = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
            currentMonthPlus2 = check.getMonth() + 'ee' + check.getFullYear();
        }
        return claimCheckDate === (currentDate.getMonth() + 'ee' + currentDate.getFullYear()) || claimCheckDate === currentMonthPlus1
            || claimCheckDate === currentMonthPlus2;
    }
};
OtherClaimsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        gamefi_service_1.GamefiService,
        red_kite_service_1.RedKiteService])
], OtherClaimsService);
exports.OtherClaimsService = OtherClaimsService;
//# sourceMappingURL=other-claims.service.js.map