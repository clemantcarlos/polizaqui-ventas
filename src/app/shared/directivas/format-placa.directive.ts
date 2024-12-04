import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatPlaca]',
})
export class FormatPlacaDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.el.nativeElement.value = this.formatPlaca(value);
  }

  private formatPlaca(value: string): string {
    if (!value) return value;

    // Remove non-alphanumeric characters except the dash
    value = value.replace(/[^A-Z0-9]/g, '');

    // Ensure the length is within limits
    const maxLength = 9;
    value = value.slice(0, maxLength);

    // Split the string into parts
    const letters = value.slice(0, 4).toUpperCase();
    const numbers = value.slice(4, 8);

    // Combine the parts with a hyphen
    return letters + (numbers ? '-' + numbers : '');
  }
}
