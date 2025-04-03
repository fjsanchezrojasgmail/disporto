import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultText',
  standalone: true
})
export class DefaultTextPipe implements PipeTransform {

  transform(value: string | number | undefined | null, text: string): string {
    return value?.toString() ?? text;
  }

}
