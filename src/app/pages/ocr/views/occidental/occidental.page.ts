import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-occidental',
  templateUrl: './occidental.page.html',
  styleUrls: ['./occidental.page.scss'],
})
export class OccidentalPage implements OnInit {
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
    return this.navCtrl.navigateRoot('image-occiental');
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
    return this.navCtrl.navigateRoot('uploads-occidental');
  }

  // Método para enviar documentos
  public submitDocuments() {
    if (this.navigate === 'RCV auto') {
      this.requestNotification();
      this.navCtrl.navigateRoot('plan-occidental-rcv');
    } else if(this.navigate === 'Servicio de Grúa'){
      this.requestNotification();
      this.navCtrl.navigateRoot('plan-occidental-rcv');
    }
  }

  // Método para solicitar notificación
  private async requestNotification() {
    const notificationData = {
      title: 'PolizAqui te informa 📢',
      message: `Tus documentos han sido verificados. Tu póliza está en proceso de emisión.`,
    };
    return await this.NotificationService.sendNotification(notificationData);
  }

  ngOnInit() {
    this.checkScannedStatus();
    const data: any = localStorage.getItem('plan');
    this.navigate = JSON.parse(data);
  }
}
