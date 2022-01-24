import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixColorChip'
})
export class FixColorChipPipe implements PipeTransform {

  transform(color: string): string {

    if (!color.startsWith('rgba')){
      return color;
    }

    const obj = {}
    const numsStr = color.split('(');
    const splitted = numsStr[1].split(',');
    let j = 0;
    splitted.forEach(item => {
      const intValue = parseInt(item);
      if (!!intValue){
        obj[j] = intValue;
        j++;
      }
    });
    return `rgb(${obj['0']}, ${obj['1']}, ${obj['2']})`;
  }

}
