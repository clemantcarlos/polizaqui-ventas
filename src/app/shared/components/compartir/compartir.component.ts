import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-compartir',
  templateUrl: './compartir.component.html',
  styleUrls: ['./compartir.component.scss'],
})
export class CompartirComponent implements OnInit {

  @Input() item: any;  // Este es el objeto que contiene la información de la póliza
  @Output() closeModal = new EventEmitter<void>();
  @Input() modalCompartir: any;

  constructor() { }

  ngOnInit() {
  }

  closeModalCompatir() {
    this.closeModal.emit();
  }

  // Función para descargar el documento de la póliza
  downloadPolicy(): void {
    console.log('Descargando documento');
    if (this.item && this.item.documento_poliza) {
      window.open(this.item.documento_poliza, '_blank');
    } else {
      console.error('No hay documento disponible');
    }
  }
  
  shareByEmail(): void {
    console.log('Enviando por email');
    if (this.item && this.item.email_usuario && this.item.documento_poliza) {
      const subject = 'Poliza Document';
      const body = `Puedes ver el documento de la póliza en el siguiente enlace: ${this.item.documento_poliza}`;
      window.location.href = `mailto:${this.item.email_usuario}?subject=${subject}&body=${body}`;
    } else {
      console.error('No hay email o documento disponible');
    }
  }
  
  shareByWhatsapp(): void {
    console.log('Enviando por WhatsApp');
    if (this.item && this.item.documento_poliza) {
      const message = `Hola, te comparto el documento de la póliza: ${this.item.documento_poliza}`;
      const encodedMessage = encodeURIComponent(message);
      
      // Cambiado para abrir WhatsApp nativo en lugar de la versión web
      window.open(`whatsapp://send?text=${encodedMessage}`, '_blank');
    } else {
      console.error('No hay documento disponible');
    }
  }
  
  
}
