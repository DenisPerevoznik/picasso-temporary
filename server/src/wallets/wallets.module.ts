import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import {HttpModule} from "@nestjs/axios";
import {HelperService} from "../shared/services/helper.service";

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, HelperService],
  imports: [HttpModule]
})
export class WalletsModule {}
