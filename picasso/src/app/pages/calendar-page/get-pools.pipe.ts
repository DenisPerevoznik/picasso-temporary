import { Pipe, PipeTransform } from '@angular/core';
import {CalendarDate, PoolData} from "../../shared/models";

@Pipe({
  name: 'getPools'
})
export class GetPoolsPipe implements PipeTransform {

  transform(day: CalendarDate): PoolData[] {
    let pools: PoolData[] = [];
    Object.keys(day.otherPools).forEach(platformKey => {
      pools = [...pools, ...day.otherPools[platformKey]];
    });
    return pools;
  }
}
