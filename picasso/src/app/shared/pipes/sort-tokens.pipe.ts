import { Pipe, PipeTransform } from '@angular/core';
import {Token} from "../models";

@Pipe({
  name: 'sortTokens'
})
export class SortTokensPipe implements PipeTransform {

  transform(tokens: Token[], field: '24h' | '7d' | 'none', mode: 'up' | 'down'): Token[] {

    if (field === 'none'){
      return tokens;
    }

    const key = 'pricePercentage' + field;
    return tokens.sort((a, b) => {
      return mode === 'up'
        ? b[key] - a[key]
        : a[key] - b[key]
    })
  }

}
