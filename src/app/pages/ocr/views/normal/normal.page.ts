import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-normal',
  templateUrl: './normal.page.html',
  styleUrls: ['./normal.page.scss'],
})
export class NormalPage implements OnInit {

  isInsuranceScanned: boolean = false;
  isSubmitDisabled: boolean = true;
  isAllScanned: boolean = false;
  private NotificationService = inject( NotificationService );
  private navCtrl = inject( NavController );
  private idRouting : any;

  constructor() { }


  /********
  * chekedStatus
  *******/

  private checkScannedStatus() {
    this.isInsuranceScanned = !!localStorage.getItem('documento_identidad');
    this.isAllScanned = this.isInsuranceScanned;
    this.updateSubmitButtonStatus();
  }

  private updateSubmitButtonStatus() {
    this.isSubmitDisabled = !this.isAllScanned;
  }

   public scanDocument(documentType: string) {
    localStorage.setItem('CURRENT_DOCUMENTO_SCAN', documentType);
    this.isInsuranceScanned = true;
    this.checkScannedStatus(); 
   return this.navCtrl.navigateRoot('a9b54f87d1e4c2a7d9e8c6b3f7a4c9b1');
  }

  public scanAdjuntar(documentType: string) {
    localStorage.setItem('CURRENT_DOCUMENTO_ADJUNTO',documentType);
    this.isInsuranceScanned = true;
    this.checkScannedStatus(); 
   return this.navCtrl.navigateRoot('4b6d2a5f9e1c7a3c8b4e9d7f3a2b8e1')
  }

  public submitDocuments() {
    if(this.idRouting === "1"){
      this.navCtrl.navigateRoot('b9e4a6c3d1f8d2b7c9a5e4d7f3b8a1e')
    } else if(this.idRouting === "2"){
      this.navCtrl.navigateRoot('6a4d9b2f3c1e8d7b5c9e4a7f3d2a1b8')
    }
  }

    /********
   * notificationService
   ********/

    private async requestNotification() {
      const notificationData = {
        title: 'PolizAqui te informa 📢',
        message: `Estimado usuario, para proceder al siguiente paso, por favor escanea y envía el siguientes documento:
        
        - Cédula de Identidad
      
        Agradecemos tu colaboración.`,
      }
      return await this.NotificationService.sendNotification(notificationData);
    }

  ngOnInit() {
    this.checkScannedStatus();
    this.requestNotification();
    this.idRouting = JSON.parse(localStorage.getItem('id-routing')|| '[]')
  }

}
