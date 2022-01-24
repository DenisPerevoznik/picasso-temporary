import { Module } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Claim} from "./entities/claim.entity";
import {OtherClaimsService} from "./other-claims/other-claims.service";
import {GamefiService} from "../events/pools/gamefi.service";
import {RedKiteService} from "../events/pools/red-kite.service";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [SequelizeModule.forFeature([Claim]), HttpModule],
  providers: [
      ClaimsService,
      OtherClaimsService,
      GamefiService,
      RedKiteService
  ],
    exports: [OtherClaimsService]
})
export class ClaimsModule {}
