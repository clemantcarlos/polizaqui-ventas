import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCedula]',
})
export class CedulaDirective {

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('blur') onBlur() {
    this.formatDate();
  }

  private formatDate() {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value;
    
    // Eliminar caracteres no numéricos
    value = value.replace(/\D/g, '');
    
    // Formatear la fecha en el formato dd/MM/yyyy
    if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    }
    if (value.length > 5) {
      value = value.replace(/(\d{2}\/\d{2})(\d{0,4})/, '$1/$2');
    }
    
    input.value = value;
  }
}
