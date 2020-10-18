import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearchPipe'
})
export class HighlightSearchPipePipe implements PipeTransform {

  transform(value: string, search: string): string {
    const valueStr = value + ''; // Ensure numeric values are converted to strings
    return valueStr.replace(new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + search + ')(?![^<>]*>)(?![^&;]+;)', 'gi'), '<strong class="highlight-searching-text">$1</strong>');
  }

}
