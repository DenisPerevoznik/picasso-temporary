"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const helper_service_1 = require("./services/helper.service");
const bsc_launch_service_1 = require("../events/pools/bsc-launch.service");
const bsc_station_service_1 = require("../events/pools/bsc-station.service");
const gamefi_service_1 = require("../events/pools/gamefi.service");
const red_kite_service_1 = require("../events/pools/red-kite.service");
const poolz_finance_service_1 = require("../events/pools/poolz-finance.service");
const seedify_service_1 = require("../events/pools/seedify.service");
const truepnl_service_1 = require("../events/pools/truepnl.service");
const axios_1 = require("@nestjs/axios");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        providers: [
            helper_service_1.HelperService,
            bsc_launch_service_1.BscLaunchService,
            bsc_station_service_1.BscStationService,
            gamefi_service_1.GamefiService,
            red_kite_service_1.RedKiteService,
            poolz_finance_service_1.PoolzFinanceService,
            seedify_service_1.SeedifyService,
            truepnl_service_1.TruepnlService
        ],
        exports: [
            helper_service_1.HelperService,
            bsc_launch_service_1.BscLaunchService,
            bsc_station_service_1.BscStationService,
            gamefi_service_1.GamefiService,
            red_kite_service_1.RedKiteService,
            poolz_finance_service_1.PoolzFinanceService,
            seedify_service_1.SeedifyService,
            truepnl_service_1.TruepnlService,
            axios_1.HttpModule
        ]
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map