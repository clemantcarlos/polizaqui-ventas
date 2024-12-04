import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-final-compartir',
  templateUrl: './final-compartir.component.html',
  styleUrls: ['./final-compartir.component.scss'],
})
export class FinalCompartirComponent  implements OnInit {

  @Input() item: any;  // Este es el objeto que contiene la información de la póliza
  @Output() closeModal = new EventEmitter<void>();
  @Input() modalFinal: any;

  constructor() { }

  ngOnInit() {
  }

  closeModalCompatir() {
    this.closeModal.emit();
  }

  // Función para descargar el documento de la póliza
  downloadPolicy(): void {
    console.log('Descargando documento');
    if (this.item && this.item) {
      window.open(this.item, '_blank');
    } else {
      console.error('No hay documento disponible');
    }
  }
  
  shareByEmail(): void {
    console.log('Enviando por email');
    if (this.item && this.item && this.item) {
      const subject = 'Poliza Document';
      const body = `Puedes ver el documento de la póliza en el siguiente enlace: ${this.item}`;
      window.location.href = `mailto:${this.item}?subject=${subject}&body=${body}`;
    } else {
      console.error('No hay email o documento disponible');
    }
  }
  
  shareByWhatsapp(): void {
    console.log('Enviando por WhatsApp');
    if (this.item && this.item) {
      const message = `Hola, te comparto el documento de la póliza: ${this.item}`;
      const encodedMessage = encodeURIComponent(message);
      
      // Cambiado para abrir WhatsApp nativo en lugar de la versión web
      window.open(`whatsapp://send?text=${encodedMessage}`, '_blank');
    } else {
      console.error('No hay documento disponible');
    }
  }
  
}
