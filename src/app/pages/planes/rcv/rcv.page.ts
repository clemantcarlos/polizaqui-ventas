import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rcv',
  templateUrl: './rcv.page.html',
  styleUrls: ['./rcv.page.scss'],
})
export class RcvPage implements OnInit {

  /*******
   * variables consecutivas
   ******/

  private navCtrl = inject( NavController );

  constructor() { }

  /******
   * clear caché
   *****/

  public routingNavigate(): void {
    this.navCtrl.navigateRoot(['2d4b8e3c1a7f9d5e6c9a4d8f3b1a7e2']);
    localStorage.removeItem('CURRENT_SCAN');
    localStorage.removeItem('CURRENT_ADJUNTO')
    localStorage.removeItem('OCR_LICENCIA');
    localStorage.removeItem('OCR_CARNET');
    localStorage.removeItem('OCR_CEDULA')
  }

  
  dataInformation = {
    name: 'RCV AUTO',
    costo_anual: '45'
  };

  ngOnInit() {
    localStorage.setItem('infoPlan', JSON.stringify(this.dataInformation));

    
  }

}
