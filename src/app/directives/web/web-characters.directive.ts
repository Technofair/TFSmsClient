import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: '[webChars]'
})
export class WebCharactersDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const inputValue = this.el.nativeElement.value;
    const sanitizedValue = this.sanitizeInput(inputValue);
    this.el.nativeElement.value = sanitizedValue;
  }

  private sanitizeInput(value: string): string {
    // Allow only valid email address characters
    const sanitizedValue = value.replace(/[^a-zA-Z0-9-_.`!$@+%/?=]/g, '');
    return sanitizedValue;
  }
}



// import { Directive } from '@angular/core';

// @Directive({
//   selector: '[appWebCharacters]'
// })
// export class WebCharactersDirective {

//   constructor() { }

// }
