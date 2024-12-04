import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-products-occidental',
  templateUrl: './products-occidental.page.html',
  styleUrls: ['./products-occidental.page.scss'],
})
export class ProductsOccidentalPage implements OnInit {


    /******
   * variables consecutivas
   ******/

    title:string = 'Productos de Seguros';
    private navCtrl = inject( NavController );

  constructor() { }

  public navigateRouting(id:string,name:string) {
    localStorage.setItem('id-routing',JSON.stringify(id))
    if(id === '0'){
       this.navCtrl.navigateRoot('plan-rcv')
       localStorage.setItem('Descripcion_occidental',JSON.stringify(name))
       const plan = 'RCV auto'
       const nPlan = '034'
       localStorage.setItem('nPlan',JSON.stringify(nPlan))
       localStorage.setItem('plan',JSON.stringify(plan))
       localStorage.setItem('price',JSON.stringify('33'))
    }else if(id === '1'){
      this.navCtrl.navigateRoot('plan-grua')
      const plan = 'Servicio de Grúa'
      const nPlan = '035'
      localStorage.setItem('Descripcion_occidental',JSON.stringify(name))
      localStorage.setItem('nPlan',JSON.stringify(nPlan))
      localStorage.setItem('plan',JSON.stringify(plan))
      localStorage.setItem('price',JSON.stringify('120'))
  }else if(id === '3'){
      this.navCtrl.navigateRoot('**')
    }
  }

  /*******
   * requestCamera
   *******/
  
  async  requestCameraPermissions() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        // Manejar errores y permisos denegados
        console.error('Error al solicitar permisos para la cámara:', error);
        return false;
      }
    } else {
      console.error('La API getUserMedia no está disponible en este navegador.');
      return false;
    }}

  ngOnInit() {
      this.requestCameraPermissions()
  }
}
