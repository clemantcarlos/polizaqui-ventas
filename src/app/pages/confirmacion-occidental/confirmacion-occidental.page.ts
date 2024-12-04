import { Component, inject, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-confirmacion-occidental',
  templateUrl: './confirmacion-occidental.page.html',
  styleUrls: ['./confirmacion-occidental.page.scss'],
})
export class ConfirmacionOccidentalPage implements OnInit {
  private toast = inject(ToastController);
  private navCtrl = inject(NavController);
  public showLoading = false;
  private NotificationService = inject(NotificationService);
  private poliza: any = '';
  public isDisabled = true;

  constructor() {}

  ngOnInit() {
    this.showLoading = true
    this.requestNotification();
    setTimeout(() => {
      this.isDisabled = false;
      this.showLoading = false
      this.storageService();
      // this.requestNotification1()
    }, 6000);
  }

  /*********************************************/
  /******** toastController Messages ***********/
  /*********************************************/

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  async downloadPDF() {
    if (this.poliza) {
      const link = document.createElement('a');
      link.href = this.poliza;
      link.download = 'poliza.pdf'; // Nombre del archivo descargado
      link.target = '_blank'; // Abre en una nueva pestaña
      link.click();
      this.presentToast('Archivo descargado exitosamente 😁','success');
    } else {
      this.presentToast('No se pudo encontrar la URL de la póliza.', 'danger');
    }
  }

  requestNotification(): void {
    const notificationData = {
      title: '¡Gracias por Preferir PolizAqui! 😁',
      message: `Gracias por tu compra en PolizAqui! Tu póliza ha sido emitida y enviada a tu correo.`,
    };
    this.NotificationService.sendNotification(notificationData);
  }

  private requestNotification1(): void {
    const notificationData = {
      title: 'PolizAqui te informa 📢',
      message: `Tu póliza vence en 30 días. Renueva ahora para asegurar tu cobertura continua con PolizAqui.`,
    };
    this.NotificationService.sendNotification(notificationData);
  }

  private storageService() {
    const data: any = localStorage.getItem('poliza');
    if (data) {
      this.poliza = JSON.parse(data)      
      console.log(this.poliza);
        
    } else {
      this.presentToast('No se encontraron datos de póliza en el almacenamiento local.', 'danger');
    }
  }

  public routingNavigate() {
    localStorage.clear()
    this.navCtrl.navigateRoot(['b4d9ef72dc4a9b91e8a1d6b9d1a423a7']).then(() => {
      window.location.reload();
    });
  }
}
