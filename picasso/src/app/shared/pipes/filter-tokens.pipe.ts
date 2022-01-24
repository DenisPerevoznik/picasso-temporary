import { Pipe, PipeTransform } from '@angular/core';
import {Token} from "../models";

@Pipe({
  name: 'filterTokens'
})
export class FilterTokensPipe implements PipeTransform {

  transform(tokens: Token[], value: number, status: boolean): Token[] {

    if (!status){
      return tokens;
    }

    return tokens.filter(t => t.balance >= value);
  }

}
