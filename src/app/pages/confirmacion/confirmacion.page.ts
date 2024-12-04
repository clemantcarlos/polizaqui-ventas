import { Component, inject, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage implements OnInit {
  private toast = inject(ToastController);
  private navCtrl = inject(NavController);
  public showLoading = false;
  private NotificationService = inject(NotificationService);
  private poliza: any = '';
  public isDisabled = true;
  public numerodepoliza : any
  public polizaN : any
  public docuemnto : any;
  public link : any
  modalFinal : boolean = false;
  public item : any

  constructor() {}

  ngOnInit() {
    this.showLoading = true
    this.requestNotification();
    setTimeout(() => {
      this.isDisabled = false;
      this.showLoading = false
      this.getStorageData();
    }, 6000);
  }


  private getStorageData() {
    const numeroPoliza = JSON.parse(localStorage.getItem('cnpoliza') || '[]');
    const documento = JSON.parse(localStorage.getItem('documento_identidad') || '[]');
    const data = JSON.parse(localStorage.getItem('Correo_Poliza') || '[]');
    const data1: any = localStorage.getItem('poliza');
    this.link = data.urlpoliza; // Enlace de descarga
    this.poliza = JSON.parse(data1) || this.link
    console.log(numeroPoliza);
    this.polizaN = data.numero_poliza; // Número de póliza predeterminado
    this.numerodepoliza = numeroPoliza || this.polizaN;
    console.log(this.numerodepoliza);
    
    this.docuemnto = documento.numero_de_cedula;
  }


  openModal() {
    this.requestNotification();
    this.item = this.poliza.urlPoliza || this.link;
    this.modalFinal = true
  }

  closeModal(){
    this.modalFinal = false;
  }

  requestNotification(): void {
    const notificationData = {
      title: '¡Gracias por Preferir PolizAqui! 😁',
      message: `Estimado usuario, agradecemos sinceramente que hayas elegido nuestro servicio. 
      No olvides descargar tu póliza desde tu correo electrónico para obtener todos los detalles o del boton compartir.
      Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por tu confianza!`,
    };
    this.NotificationService.sendNotification(notificationData);
  }

 
  public routingNavigate() {
    localStorage.clear()
    this.navCtrl.navigateRoot(['b4d9ef72dc4a9b91e8a1d6b9d1a423a7']).then(() => {
      window.location.reload();
    });
  }
}
