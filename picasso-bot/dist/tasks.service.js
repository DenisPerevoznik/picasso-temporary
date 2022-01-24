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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const rxjs_1 = require("rxjs");
const bsc_launch_service_1 = require("./events/pools/bsc-launch.service");
const bsc_station_service_1 = require("./events/pools/bsc-station.service");
const gamefi_service_1 = require("./events/pools/gamefi.service");
const red_kite_service_1 = require("./events/pools/red-kite.service");
const poolz_finance_service_1 = require("./events/pools/poolz-finance.service");
const seedify_service_1 = require("./events/pools/seedify.service");
const truepnl_service_1 = require("./events/pools/truepnl.service");
const events_service_1 = require("./events/events.service");
const helper_service_1 = require("./shared/services/helper.service");
const other_claims_service_1 = require("./claims/other-claims/other-claims.service");
let TasksService = TasksService_1 = class TasksService {
    constructor(helper, otherClaimService, bscLaunchService, bscStationService, gameFiService, redKiteService, poolzFinanceService, seediFyService, truepnlService, eventsService) {
        this.helper = helper;
        this.otherClaimService = otherClaimService;
        this.bscLaunchService = bscLaunchService;
        this.bscStationService = bscStationService;
        this.gameFiService = gameFiService;
        this.redKiteService = redKiteService;
        this.poolzFinanceService = poolzFinanceService;
        this.seediFyService = seediFyService;
        this.truepnlService = truepnlService;
        this.eventsService = eventsService;
        this.logger = new common_1.Logger(TasksService_1.name);
        this.productionBotToken = '1970140903:AAFuHv_DGsyyv0PiVn4T9rpl370kYhTXj5I';
        this.devBotToken = '2078418261:AAHVqgidUmBoe8F_xlc0XsA23s-Yx1Wiq94';
        this.cryptoChatId = -1001572721189;
        this.bot = null;
        this.setBot();
    }
    async setBot() {
        const TelegramBot = require('node-telegram-bot-api');
        console.log('Bot initialized');
        this.bot = new TelegramBot(this.productionBotToken, { polling: true });
    }
    handleCron() {
        this.logger.debug('Bot sent a daily message');
        this.getPoolsMessage()
            .subscribe(poolsMsg => {
            this.bot.sendMessage(this.cryptoChatId, poolsMsg);
            this.getClaimsMessage()
                .subscribe(claimsMsg => {
                this.bot.sendMessage(this.cryptoChatId, claimsMsg);
            });
        });
    }
    getClaimsMessage() {
        let message = 'Сбор токенов:\n\n';
        let flag = false;
        const currentDate = new Date();
        return (0, rxjs_1.forkJoin)([
            this.otherClaimService.getCompletedGameFiClaims(),
            this.otherClaimService.getRedKiteData(),
            this.otherClaimService.getCompletedRedKiteClaim(),
            this.otherClaimService.getGameFiData(),
            this.otherClaimService.getSfundData()
        ])
            .pipe((0, rxjs_1.mergeMap)((elements) => {
            elements.forEach((claims) => {
                claims.filter(claim => claim.date
                    && claim.date.getDate() === currentDate.getDate()
                    && claim.date.getMonth() === currentDate.getMonth()
                    && claim.date.getFullYear() === currentDate.getFullYear())
                    .forEach(claim => {
                    flag = true;
                    message += `💰 Токен -> ${claim.token}\n`;
                    message += ` Площадка -> ${claim.source}\n`;
                    message += ` Сеть -> ${claim.chain}\n`;
                    message += ` Процент -> ${claim.percentage}%\n`;
                    message += ` Время -> ${this.helper.getTime(new Date(claim.date))}\n`;
                    message += '=============';
                    message += `\n\n`;
                });
            });
            if (flag) {
                return (0, rxjs_1.of)(message);
            }
            return (0, rxjs_1.of)('Сегодня не запланирован сбор токенов');
        }));
    }
    getPoolsMessage() {
        let message = '👋 Напоминаю о сегодняшних событиях:\n\n';
        const currentDate = new Date();
        let poolsSize = 0;
        return (0, rxjs_1.forkJoin)([
            this.bscLaunchService.getData(),
            this.bscStationService.getData(),
            this.gameFiService.getData(),
            this.redKiteService.getData(),
            this.poolzFinanceService.getData(),
            this.seediFyService.getData(),
            this.truepnlService.getData(),
        ])
            .pipe((0, rxjs_1.tap)(data => {
            data.forEach((poolElements) => {
                poolElements.filter(item => item.calendarDateTime
                    && item.calendarDateTime.getDate() === currentDate.getDate()
                    && item.calendarDateTime.getMonth() === currentDate.getMonth()
                    && item.calendarDateTime.getFullYear() === currentDate.getFullYear())
                    .forEach((item, index) => {
                    poolsSize++;
                    const date = this.helper.getFixedDateString(item.displayTime);
                    message += `🔘 ${index + 1}. Название - ${item.title} (${item.symbol})\n`;
                    message += `(Источник) Площадка - ${item.sourceName}\n`;
                    message += `Тип - ${item.type}\n`;
                    message += `${item.infoTitle}: ${date}`;
                    message += `\n\n`;
                });
            });
        }), (0, rxjs_1.mergeMap)(() => {
            return (0, rxjs_1.from)(this.eventsService.findAllByDate(new Date()))
                .pipe((0, rxjs_1.tap)((data) => {
                data.forEach((item, index) => {
                    const metaData = JSON.parse(item.metadata);
                    const date = this.helper.getFixedDateString(new Date(item.date), false);
                    message += `🔘 ${(index + 1) + poolsSize}. Название - ${item.title} (${item.tokenName})\n`;
                    message += `Дата: ${date}\n`;
                    message += `Доп. информация:\n`;
                    metaData.forEach(metaItem => {
                        message += ` ${metaItem.title} -> ${metaItem.value}\n`;
                    });
                    message += '=============';
                    message += `\n\n`;
                });
            }), (0, rxjs_1.mergeMap)((data) => {
                if (!data.length && !poolsSize) {
                    return (0, rxjs_1.of)('На сегодня событий нету ☹️');
                }
                return (0, rxjs_1.of)(message);
            }));
        }));
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksService.prototype, "handleCron", null);
TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_1.HelperService,
        other_claims_service_1.OtherClaimsService,
        bsc_launch_service_1.BscLaunchService,
        bsc_station_service_1.BscStationService,
        gamefi_service_1.GamefiService,
        red_kite_service_1.RedKiteService,
        poolz_finance_service_1.PoolzFinanceService,
        seedify_service_1.SeedifyService,
        truepnl_service_1.TruepnlService,
        events_service_1.EventsService])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map