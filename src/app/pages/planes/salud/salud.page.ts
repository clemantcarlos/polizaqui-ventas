import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-salud',
  templateUrl: './salud.page.html',
  styleUrls: ['./salud.page.scss'],
})
export class SaludPage implements OnInit {

  /******
   * variables consecutivas
   ******/

  private navCtrl = inject( NavController );

  constructor() { }

    /******
   * clear caché
   *****/

    public routingNavigate(): void {
      this.navCtrl.navigateRoot(['9d3a6e2b1f7c4d8e5b9a4c7f8a1d2c9']);
      localStorage.removeItem('CURRENT_DOCUMENTO_SCAN');
      localStorage.removeItem('CURRENT_DOCUMENTO_ADJUNTO')
      localStorage.removeItem('documento_identidad')
    }

    dataInformation = {
      name: 'Producto 3en1',
      coberturas: [
        {
          vida: '500.00',
          Funerario: '600.00',
          muerte_Accidental: '1.100.00',
          Invalidez_Total: '1.100.00'
        }
      ],
      costo_anual: '12'
    };
    
    ngOnInit() {
      localStorage.setItem('infoPlan', JSON.stringify(this.dataInformation));
    }
    

}
