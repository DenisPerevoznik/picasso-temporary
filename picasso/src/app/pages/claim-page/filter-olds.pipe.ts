import { Pipe, PipeTransform } from '@angular/core';
import {ClaimConfig} from "../../shared/models";

@Pipe({
  name: 'filterOlds'
})
export class FilterOldsPipe implements PipeTransform {

  transform(notShowOld: boolean, elements: ClaimConfig[]): ClaimConfig[] {
    return notShowOld ? elements.filter(it => new Date(it.date).getTime() >= new Date().getTime()) : elements;
  }

}
