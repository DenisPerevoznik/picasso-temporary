import { BscLaunchService } from "./events/pools/bsc-launch.service";
import { BscStationService } from "./events/pools/bsc-station.service";
import { GamefiService } from "./events/pools/gamefi.service";
import { RedKiteService } from "./events/pools/red-kite.service";
import { PoolzFinanceService } from "./events/pools/poolz-finance.service";
import { SeedifyService } from "./events/pools/seedify.service";
import { TruepnlService } from "./events/pools/truepnl.service";
import { EventsService } from "./events/events.service";
import { HelperService } from "./shared/services/helper.service";
import { OtherClaimsService } from "./claims/other-claims/other-claims.service";
export declare class TasksService {
    private helper;
    private otherClaimService;
    private bscLaunchService;
    private bscStationService;
    private gameFiService;
    private redKiteService;
    private poolzFinanceService;
    private seediFyService;
    private truepnlService;
    private eventsService;
    private readonly logger;
    private readonly productionBotToken;
    private readonly devBotToken;
    private readonly cryptoChatId;
    private bot;
    constructor(helper: HelperService, otherClaimService: OtherClaimsService, bscLaunchService: BscLaunchService, bscStationService: BscStationService, gameFiService: GamefiService, redKiteService: RedKiteService, poolzFinanceService: PoolzFinanceService, seediFyService: SeedifyService, truepnlService: TruepnlService, eventsService: EventsService);
    setBot(): Promise<void>;
    handleCron(): void;
    private getClaimsMessage;
    private getPoolsMessage;
}
