import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {BscLaunchService} from "./pools/bsc-launch.service";
import {catchError, forkJoin, of} from "rxjs";
import {BscStationService} from "./pools/bsc-station.service";
import {GamefiService} from "./pools/gamefi.service";
import {RedKiteService} from "./pools/red-kite.service";
import {PoolzFinanceService} from "./pools/poolz-finance.service";
import {TruepnlService} from "./pools/truepnl.service";
import {GetEventsDto} from "./dto/get-events.dto";
import {SeedifyService} from "./pools/seedify.service";

@Controller('events')
export class EventsController {
  constructor(
      private readonly eventsService: EventsService,
      private bscLaunch: BscLaunchService,
      private bscStation: BscStationService,
      private gamefi: GamefiService,
      private redkite: RedKiteService,
      private poolzFinance: PoolzFinanceService,
      private truepnl: TruepnlService,
      private seedifyService: SeedifyService,
  ) {}

  @Get('other-pools')
  getOtherPools(){

    return forkJoin({
      bsclaunch: this.bscLaunch.getData(),
      bscstation: this.bscStation.getData(),
      gamefi: this.gamefi.getData(),
      redkite: this.redkite.getData(),
      poolzfinance: this.poolzFinance.getData(),
      truepnl: this.truepnl.getData(),
      seedifyfund: this.seedifyService.getData()
    });
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Post('by-date')
  findAllByDate(@Body() getEventsDto: GetEventsDto){
    return this.eventsService.findAllByYearAndMonth(getEventsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
