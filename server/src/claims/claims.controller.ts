import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import {OtherClaimsService} from "./other-claims/other-claims.service";
import {forkJoin} from "rxjs";
import {map} from "rxjs/operators";

@Controller('claims')
export class ClaimsController {
  constructor(
      private readonly claimsService: ClaimsService,
      private readonly otherClaimsService: OtherClaimsService
      ) {}

  @Get('other-claims')
  getOtherClaims() {
    return forkJoin([
      this.otherClaimsService.getSfundData(),
      this.otherClaimsService.getGameFiData(),
      this.otherClaimsService.getCompletedGameFiClaims(),
      this.otherClaimsService.getRedKiteData(),
      this.otherClaimsService.getCompletedRedKiteClaim(),
    ])
        .pipe(map(data => data[0]));
  }

  @Post()
  create(@Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.create(createClaimDto);
  }

  @Get()
  findAll() {
    return this.claimsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.claimsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(+id, updateClaimDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.claimsService.remove(+id);
  }
}
