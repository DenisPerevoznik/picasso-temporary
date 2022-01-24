import {Module} from "@nestjs/common";
import {HelperService} from "./services/helper.service";
import {BscLaunchService} from "../events/pools/bsc-launch.service";
import {BscStationService} from "../events/pools/bsc-station.service";
import {GamefiService} from "../events/pools/gamefi.service";
import {RedKiteService} from "../events/pools/red-kite.service";
import {PoolzFinanceService} from "../events/pools/poolz-finance.service";
import {SeedifyService} from "../events/pools/seedify.service";
import {TruepnlService} from "../events/pools/truepnl.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [
        HelperService,
        BscLaunchService,
        BscStationService,
        GamefiService,
        RedKiteService,
        PoolzFinanceService,
        SeedifyService,
        TruepnlService
    ],
    exports: [
        HelperService,
        BscLaunchService,
        BscStationService,
        GamefiService,
        RedKiteService,
        PoolzFinanceService,
        SeedifyService,
        TruepnlService,
        HttpModule
    ]
})
export class SharedModule{}
