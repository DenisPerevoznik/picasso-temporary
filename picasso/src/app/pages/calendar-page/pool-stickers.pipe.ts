import { Pipe, PipeTransform } from '@angular/core';
import {CalendarDate, PlatformIcons, Platforms} from "../../shared/models";

@Pipe({
  name: 'poolStickers',
  pure: false
})
export class PoolStickersPipe implements PipeTransform {

  transform(day: CalendarDate, isCustomEvent = false): string[] {

    if (!day) {
      return [];
    }

    if (isCustomEvent){
      const obj = {};
      day.events.forEach(event => {
        const key = event.icon ? event.icon : PlatformIcons.Picasso;
        obj[key] = true;
      });

      return Object.keys(obj);
    }

    if (!Object.keys(day.otherPools).length){
      return [];
    }

    return <string[]>Object.keys(day.otherPools)
      .filter(platformKey => day.otherPools[platformKey] && day.otherPools[platformKey].length)
      .map(platformKey => {
      switch (platformKey){
        case Platforms.GameFi:
          return PlatformIcons.GameFi;

        case Platforms.LZ:
          return PlatformIcons.LZ;

        case Platforms.KrystalGo:
          return PlatformIcons.KrystalGo;

        case Platforms.RedKite:
          return PlatformIcons.RedKite;

        case Platforms.TrustPad:
          return PlatformIcons.TrustPad;

        case Platforms.PoolzFinance:
          return PlatformIcons.PoolzFinance;

        case Platforms.NFTPad:
          return PlatformIcons.NFTPad;

        case Platforms.SeedifyFund:
          return PlatformIcons.SeedifyFund;

        case Platforms.BscStation:
          return PlatformIcons.BscStation;

        case Platforms.BscLaunch:
          return PlatformIcons.BscLaunch;

        case Platforms.Truepnl:
          return PlatformIcons.Truepnl;

        default:
          return PlatformIcons.Picasso;
      }
    });
  }

}
