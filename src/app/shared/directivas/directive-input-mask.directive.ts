import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDirectiveInputMask]',
})
export class DirectiveInputMaskDirective {

  /*********************************************/
  /******** Directive upperCaseInput ***********/
  /*********************************************/

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.toUpperCase();
  }

}
