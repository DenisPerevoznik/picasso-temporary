"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const sequelize_1 = require("@nestjs/sequelize");
const events_module_1 = require("./events/events.module");
const claims_module_1 = require("./claims/claims.module");
const schedule_1 = require("@nestjs/schedule");
const tasks_service_1 = require("./tasks.service");
const shared_module_1 = require("./shared/shared.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            sequelize_1.SequelizeModule.forRoot(!!process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production'
                ? {
                    dialect: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'bwaywmbc_picasso',
                    password: 'pica$$oDB',
                    database: 'bwaywmbc_picasso',
                    autoLoadModels: true,
                    synchronize: true,
                }
                : {
                    dialect: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: 'root',
                    database: 'picasso-db',
                    autoLoadModels: true,
                    synchronize: true,
                }),
            events_module_1.EventsModule,
            claims_module_1.ClaimsModule,
            shared_module_1.SharedModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            tasks_service_1.TasksService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map