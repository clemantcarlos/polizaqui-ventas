import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-rcv',
  templateUrl: './rcv.page.html',
  styleUrls: ['./rcv.page.scss'],
})
export class RcvPage implements OnInit {

  isLicenseScanned: boolean = false;
  isRegistrationScanned: boolean = false;
  isInsuranceScanned: boolean = false;
  isSubmitDisabled: boolean = true;
  isAllScanned: boolean = false;
  private NotificationService = inject(NotificationService);
  private navCtrl = inject(NavController);
  private navigate: any;

  constructor() { }

  // Método para verificar el estado de los documentos escaneados
  private checkScannedStatus() {
    this.isLicenseScanned = !!localStorage.getItem('OCR_LICENCIA');
    this.isRegistrationScanned = !!localStorage.getItem('OCR_CARNET');
    this.isInsuranceScanned = !!localStorage.getItem('OCR_CEDULA');
    this.isAllScanned = this.isLicenseScanned && this.isRegistrationScanned && this.isInsuranceScanned;
    this.updateSubmitButtonStatus();
  }

  // Actualiza el estado del botón de envío
  private updateSubmitButtonStatus() {
    this.isSubmitDisabled = !this.isAllScanned;
  }

  // Método para manejar el escaneo de documentos
  public scanDocument(documentType: string) {
    localStorage.setItem('CURRENT_SCAN', documentType);
    
    // Actualiza el estado basado en el tipo de documento
    switch (documentType) {
      case 'licencia':
        this.isLicenseScanned = true;
        break;
      case 'carnet':
        this.isRegistrationScanned = true;
        break;
      case 'cedula':
        this.isInsuranceScanned = true;
        break;
    }

    this.checkScannedStatus();
    return this.navCtrl.navigateRoot('5c8d3e7b9a2f4a1b6e4c9d7a5b8e3f9c');
  }

  // Método para manejar la adjunción de documentos
  public scanAdjuntar(documentType: string) {
    localStorage.setItem('CURRENT_ADJUNTO', documentType);
    
    // Actualiza el estado basado en el tipo de documento
    switch (documentType) {
      case 'licencia':
        this.isLicenseScanned = true;
        break;
      case 'carnet':
        this.isRegistrationScanned = true;
        break;
      case 'cedula':
        this.isInsuranceScanned = true;
        break;
    }

    this.checkScannedStatus();
    return this.navCtrl.navigateRoot('3d9f7c5a2b4e1d8c9a6b3e7d4a9c2f8e');
  }

  // Método para enviar documentos
  public submitDocuments() {
    if (this.navigate === 'APP5') {
      this.navCtrl.navigateRoot('3c7e5b9d2f1a8d6a4c9b7e3d8f1a2c9');
    } else if (this.navigate === 'APP4') {
      this.navCtrl.navigateRoot('4a1b8e5c9d3f7d2e6c9a4b1d8e3f7c9');
    }
  }

  // Método para solicitar notificación
  private async requestNotification() {
    const notificationData = {
      title: 'PolizAqui te informa 📢',
      message: `Estimado usuario, para proceder al siguiente paso, por favor escanea y envía los siguientes tres documentos:
      - Licencia de Conducir
      - Certificado de Circulación
      - Cédula de Identidad
      
      Agradecemos tu colaboración.`,
    };
    return await this.NotificationService.sendNotification(notificationData);
  }

  ngOnInit() {
    this.checkScannedStatus();
    this.requestNotification();
    const data: any = localStorage.getItem('plan');
    this.navigate = JSON.parse(data);
  }
}
