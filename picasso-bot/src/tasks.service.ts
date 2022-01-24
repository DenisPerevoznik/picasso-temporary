import {Injectable, Logger} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {forkJoin, from, mergeMap, Observable, of, tap} from "rxjs";
import {BscLaunchService} from "./events/pools/bsc-launch.service";
import {BscStationService} from "./events/pools/bsc-station.service";
import {GamefiService} from "./events/pools/gamefi.service";
import {RedKiteService} from "./events/pools/red-kite.service";
import {PoolzFinanceService} from "./events/pools/poolz-finance.service";
import {SeedifyService} from "./events/pools/seedify.service";
import {TruepnlService} from "./events/pools/truepnl.service";
import {EventsService} from "./events/events.service";
import {HelperService} from "./shared/services/helper.service";
import {OtherClaimsService} from "./claims/other-claims/other-claims.service";

@Injectable()
export class TasksService{
    private readonly logger = new Logger(TasksService.name);
    private readonly productionBotToken = '1970140903:AAFuHv_DGsyyv0PiVn4T9rpl370kYhTXj5I';
    private readonly devBotToken = '2078418261:AAHVqgidUmBoe8F_xlc0XsA23s-Yx1Wiq94';
    private readonly cryptoChatId = -1001572721189;
    private bot: any = null;

    constructor(
        private helper: HelperService,
        private otherClaimService: OtherClaimsService,
        private bscLaunchService: BscLaunchService,
        private bscStationService: BscStationService,
        private gameFiService: GamefiService,
        private redKiteService: RedKiteService,
        private poolzFinanceService: PoolzFinanceService,
        private seediFyService: SeedifyService,
        private truepnlService: TruepnlService,
        private eventsService: EventsService
    ) {
        this.setBot();
    }

    async setBot(){
        const TelegramBot = require('node-telegram-bot-api');
        console.log('Bot initialized');
        this.bot = new TelegramBot(this.productionBotToken, { polling: true });
        // this.bot = new TelegramBot(process.env.NODE_ENV && process.env.NODE_ENV === 'production'
        //     ? this.productionBotToken : this.devBotToken, { polling: true });
    }

    // @Cron('0 */1 * * * *')
    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    handleCron(){
        this.logger.debug('Bot sent a daily message');
        this.getPoolsMessage()
            .subscribe(poolsMsg => {
                this.bot.sendMessage(this.cryptoChatId, poolsMsg);

                this.getClaimsMessage()
                    .subscribe(claimsMsg => {
                        this.bot.sendMessage(this.cryptoChatId, claimsMsg);
                    })
            });
    }

    private getClaimsMessage(): Observable<string>{
        let message = 'Сбор токенов:\n\n';
        let flag = false;
        const currentDate = new Date();

        return forkJoin([
            this.otherClaimService.getCompletedGameFiClaims(),
            this.otherClaimService.getRedKiteData(),
            this.otherClaimService.getCompletedRedKiteClaim(),
            this.otherClaimService.getGameFiData(),
            this.otherClaimService.getSfundData()
        ])
            .pipe(mergeMap((elements) => {

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
                            message += '============='
                            message += `\n\n`;
                        })
                });

                if (flag) {
                    return of(message);
                }
                return of('Сегодня не запланирован сбор токенов');
            }));
    }

    private getPoolsMessage(): Observable<string>{

        let message = '👋 Напоминаю о сегодняшних событиях:\n\n';
        const currentDate = new Date();
        let poolsSize = 0;
        return forkJoin([
            this.bscLaunchService.getData(),
            this.bscStationService.getData(),
            this.gameFiService.getData(),
            this.redKiteService.getData(),
            this.poolzFinanceService.getData(),
            this.seediFyService.getData(),
            this.truepnlService.getData(),
        ])
            .pipe(
                tap(data => {
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
                    })
                }),
                mergeMap(() => {
                    return from(this.eventsService.findAllByDate(new Date()))
                        .pipe(
                            tap((data) => {
                                data.forEach((item, index) => {
                                    const metaData: {title: string, value: string}[] = JSON.parse(item.metadata);
                                    const date = this.helper.getFixedDateString(new Date(item.date), false);
                                    message += `🔘 ${(index + 1) + poolsSize}. Название - ${item.title} (${item.tokenName})\n`;
                                    message += `Дата: ${date}\n`;
                                    message += `Доп. информация:\n`
                                    metaData.forEach(metaItem => {
                                        message += ` ${metaItem.title} -> ${metaItem.value}\n`;
                                    });
                                    message += '============='
                                    message += `\n\n`;
                                });
                            }),
                            mergeMap((data) => {
                                if (!data.length && !poolsSize){
                                    return of('На сегодня событий нету ☹️');
                                }
                                return of(message);
                            })
                        )
                })
            );
    }
}
