import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-plan-moto',
  templateUrl: './plan-moto.page.html',
  styleUrls: ['./plan-moto.page.scss'],
})
export class PlanMotoPage implements OnInit {

  constructor() { }

  private navCtrl = inject( NavController );

    
  dataInformation = {
    name: 'RCV MOTO',
    costo_anual: '20'
  };
  ngOnInit() {
    localStorage.setItem('infoPlan', JSON.stringify(this.dataInformation));

  }

  public routingNavigate(): void {
    this.navCtrl.navigateRoot(['2d4b8e3c1a7f9d5e6c9a4d8f3b1a7e2']);
    localStorage.removeItem('CURRENT_SCAN');
    localStorage.removeItem('CURRENT_ADJUNTO')
    localStorage.removeItem('OCR_LICENCIA');
    localStorage.removeItem('OCR_CARNET');
    localStorage.removeItem('OCR_CEDULA')
  }

}
