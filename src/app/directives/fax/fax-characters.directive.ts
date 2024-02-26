import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: '[faxChars]'
})
export class FaxCharactersDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const inputValue = this.el.nativeElement.value;
    const sanitizedValue = this.sanitizeInput(inputValue);
    this.el.nativeElement.value = sanitizedValue;
  }

  private sanitizeInput(value: string): string {
    // Allow only valid email address characters
    const sanitizedValue = value.replace(/[^0-9-]/g, '');
    return sanitizedValue;
  }
}



// import { Directive } from '@angular/core';

// @Directive({
//   selector: '[appFaxCharacters]'
// })
// export class FaxCharactersDirective {

//   constructor() { }

// }
