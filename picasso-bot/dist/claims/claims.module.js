"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimsModule = void 0;
const common_1 = require("@nestjs/common");
const claims_service_1 = require("./claims.service");
const sequelize_1 = require("@nestjs/sequelize");
const claim_entity_1 = require("./entities/claim.entity");
const other_claims_service_1 = require("./other-claims/other-claims.service");
const gamefi_service_1 = require("../events/pools/gamefi.service");
const red_kite_service_1 = require("../events/pools/red-kite.service");
const axios_1 = require("@nestjs/axios");
let ClaimsModule = class ClaimsModule {
};
ClaimsModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([claim_entity_1.Claim]), axios_1.HttpModule],
        providers: [
            claims_service_1.ClaimsService,
            other_claims_service_1.OtherClaimsService,
            gamefi_service_1.GamefiService,
            red_kite_service_1.RedKiteService
        ],
        exports: [other_claims_service_1.OtherClaimsService]
    })
], ClaimsModule);
exports.ClaimsModule = ClaimsModule;
//# sourceMappingURL=claims.module.js.map