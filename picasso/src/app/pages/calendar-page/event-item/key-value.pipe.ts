import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValue'
})
export class KeyValuePipe implements PipeTransform {

  transform(object: {}, index = 0): string {
    return Object.keys(object)[0];
  }

}
