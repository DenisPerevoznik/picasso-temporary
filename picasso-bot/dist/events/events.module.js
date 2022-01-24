"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const sequelize_1 = require("@nestjs/sequelize");
const event_entity_1 = require("./entities/event.entity");
const axios_1 = require("@nestjs/axios");
const bsc_launch_service_1 = require("./pools/bsc-launch.service");
const helper_service_1 = require("../shared/services/helper.service");
const bsc_station_service_1 = require("./pools/bsc-station.service");
const gamefi_service_1 = require("./pools/gamefi.service");
const red_kite_service_1 = require("./pools/red-kite.service");
const poolz_finance_service_1 = require("./pools/poolz-finance.service");
const truepnl_service_1 = require("./pools/truepnl.service");
const seedify_service_1 = require("./pools/seedify.service");
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([event_entity_1.Event]), axios_1.HttpModule],
        providers: [
            events_service_1.EventsService,
            bsc_launch_service_1.BscLaunchService,
            helper_service_1.HelperService,
            bsc_station_service_1.BscStationService,
            gamefi_service_1.GamefiService,
            red_kite_service_1.RedKiteService,
            poolz_finance_service_1.PoolzFinanceService,
            truepnl_service_1.TruepnlService,
            seedify_service_1.SeedifyService
        ],
        exports: [events_service_1.EventsService]
    })
], EventsModule);
exports.EventsModule = EventsModule;
//# sourceMappingURL=events.module.js.map