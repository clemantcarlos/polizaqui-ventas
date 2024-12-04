import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  /******
   * variables consecutivas
   ******/

  title:string = 'Productos de Seguros';
  private navCtrl = inject( NavController );
  
  constructor() { 
    this.requestCameraPermissions();
  }

  /********
   * routingNavigate
   *******/

  public navigateRouting(id:string,name:string) {
    localStorage.setItem('id-routing',JSON.stringify(id))
    if(id === '0'){
       this.navCtrl.navigateRoot('7b6c4e9d1a2f5a8d3c9b4e7f8a3d1c2')
       localStorage.setItem('Descripcion_products',JSON.stringify(name))
       const plan = 'APP4'
       localStorage.setItem('plan',JSON.stringify(plan))
       localStorage.setItem('price',JSON.stringify('20'))
    }else if(id === '1' && name === 'Gastos Funerarios') {
       this.navCtrl.navigateRoot('8a6d4e3b7c9f2a1e5b8d9c4a3f7e6d1a');
       localStorage.setItem('Descripcion_products',JSON.stringify(name))
       localStorage.setItem('price',JSON.stringify('9'))
    }else if(id === '2' && name==='Producto 3en1') {
       this.navCtrl.navigateRoot('c2a7e5f4d9b8c3d1a6b4d9e7f3a2c8b');
       localStorage.setItem('Descripcion_products',JSON.stringify(name))
       localStorage.setItem('price',JSON.stringify('12'))
    }else if(id === '3'){
      this.navCtrl.navigateRoot('**')
    } else if(id === '4'){
      this.navCtrl.navigateRoot('d5c9a4e7b3f1a2d8e6b4c9d7f8a3b1e')
      localStorage.setItem('Descripcion_products',JSON.stringify(name))
      const plan = 'APP5'
      localStorage.setItem('plan',JSON.stringify(plan))
      localStorage.setItem('price',JSON.stringify('10'))
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
    
  }

}
