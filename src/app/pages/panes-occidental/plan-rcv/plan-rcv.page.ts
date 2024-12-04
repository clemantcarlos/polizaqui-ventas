import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-plan-rcv',
  templateUrl: './plan-rcv.page.html',
  styleUrls: ['./plan-rcv.page.scss'],
})
export class PlanRcvPage implements OnInit {

   /*******
   * variables consecutivas
   ******/

   private navCtrl = inject( NavController );

  constructor() { }

  ngOnInit() {
  }

  public routingNavigate(): void {
    this.navCtrl.navigateRoot(['occidental-vista']);
    localStorage.removeItem('CURRENT_SCAN');
    localStorage.removeItem('CURRENT_ADJUNTO')
    localStorage.removeItem('OCR_LICENCIA');
    localStorage.removeItem('OCR_CARNET');
    localStorage.removeItem('OCR_CEDULA')
  }
}
