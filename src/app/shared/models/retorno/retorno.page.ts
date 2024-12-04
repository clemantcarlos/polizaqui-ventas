import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { jwtDecode } from 'jwt-decode';
import { InserDataService } from 'src/app/services/inser-data.service';

@Component({
  selector: 'app-retorno',
  templateUrl: './retorno.page.html',
  styleUrls: ['./retorno.page.scss'],
})
export class RetornoPage implements OnInit {

  private navCtrl = inject(NavController);
  private insertService = inject(InserDataService);
  public dataPoliza: any[] = [];
  private emailPoliza: any;
  public modalCompartir : boolean = false;
  public item: any [] = []

  constructor() {}

  ngOnInit() {
    const dataInfo = JSON.parse(localStorage.getItem('auth-session') || '[]');
    const informacion: any = jwtDecode(dataInfo.infoUser);
    this.emailPoliza = informacion.email;

    this.getPendPoliza();
  }

  private async getPendPoliza() {
    const response = await this.insertService.getPoliza();
    this.dataPoliza = response.data.filter((email: any) => email.email_usuario === this.emailPoliza);
    this.item = this.dataPoliza 
    console.log(this.dataPoliza);
  }

  public exitNavigate() {
    this.navCtrl.navigateBack('e1f8a6b1e5c9b54a6d4f7c8d3a5a3e58');
  }

  openModalCompartir() {
    this.modalCompartir = true;
  }

  closeModal() {
    this.modalCompartir = false;
  }

  public getPaymentData(item: any) {
    // Dependiendo del estado de la póliza, se decide la acción
    if (item.estado_poliza === 'PAGADO') {
      this.item = item;  // Asignar el item seleccionado
      this.openModalCompartir();  // Abrir el modal
    } else if (item.estado_poliza === 'PENDIENTE') {
      const data = {
        monto: item.monto,
        plan: item.plan,
        numero_poliza: item.numero_poliza
      };
  
      const email = {
        correo_titular: item.email_usuario,
        poliza: item.numero_poliza,
        fecha_emision: item.fecha_emision,
        nombre_titular: item.titular,
        fecha_cobro: item.fecha_emision,
        urlpoliza: item.documento_poliza,
        fecha_inicio: item.fecha_emision,
        numero_poliza: item.numero_poliza,
        fecha_vencimiento: item.fecha_expiracion
      };
  
      localStorage.setItem('Correo_Poliza', JSON.stringify(email));
      localStorage.setItem('paymentRetorno', JSON.stringify(data));
  
      this.navCtrl.navigateRoot('1d4c5e7b3f9a8e2a6b0d9f3c7a1b4e8');
    }
  }
  
}
