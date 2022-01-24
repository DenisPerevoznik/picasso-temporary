import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Event} from "./entities/event.entity";
import {HttpModule} from "@nestjs/axios";
import {BscLaunchService} from "./pools/bsc-launch.service";
import {HelperService} from "../shared/services/helper.service";
import {BscStationService} from "./pools/bsc-station.service";
import {GamefiService} from "./pools/gamefi.service";
import {RedKiteService} from "./pools/red-kite.service";
import {PoolzFinanceService} from "./pools/poolz-finance.service";
import {TruepnlService} from "./pools/truepnl.service";
import {SeedifyService} from "./pools/seedify.service";

@Module({
  imports: [SequelizeModule.forFeature([Event]), HttpModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    BscLaunchService,
    HelperService,
    BscStationService,
    GamefiService,
    RedKiteService,
    PoolzFinanceService,
    TruepnlService,
    SeedifyService
  ],
  exports: [EventsService]
})
export class EventsModule {}
