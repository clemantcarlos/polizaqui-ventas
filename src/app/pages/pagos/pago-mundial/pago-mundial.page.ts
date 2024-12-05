import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
// import { log } from 'console';
import { bankOption, PLan } from 'src/app/interface/syPagoBank';
import { SypagoService } from 'src/app/services/sypago.service';
import { jwtDecode } from 'jwt-decode';

import { PolizaService } from 'src/app/services/poliza.service';
import { InserDataService } from 'src/app/services/inser-data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pago-mundial',
  templateUrl: './pago-mundial.page.html',
  styleUrls: ['./pago-mundial.page.scss'],
})
export class PagoMundialPage implements OnInit {
  metodoPago: string = '';
  countOption: string = '';
  private authService = inject(SypagoService);
  public data: PLan | null = null;
  public formSyPago!: FormGroup;
  private fb = inject(FormBuilder);
  public showLoading = false;
  private toastController = inject(ToastController);
  isModalVisible: boolean = false;
  paymentData: any;
  /********* BANK MUNDIAL *******/
  // private countBank: string = '01720111531118494549';
  private countBank : string = '01143600524083976037';
  // private codeBank: string = '0172';
  private codeBank : string = '0114'
  public bank: bankOption[] = [];
  info: any;
  price: any;
  precio: any;
  monto: any;
  plan: any;
  payt: any;
  pago: any;

  // EMISION POLIZA
  descripcion: string = '';
  formPolizaData: any;
  email: any;
  private navCtrl = inject(NavController);
  private polizaService = inject(PolizaService);
  private insertData = inject(InserDataService);

  constructor() {
    this.authSyPago(), this.generateForm();
  }

  ngOnInit() {
    this.localStorage();
    const data: any = localStorage.getItem('Descripcion_products');
    const pricee: any = localStorage.getItem('price');
    const datainfo = JSON.parse(localStorage.getItem('paymentRetorno') || '[]');
    this.monto = datainfo.monto;
    this.plan = datainfo.plan;
    this.info = JSON.parse(data);
    this.price = JSON.parse(pricee);
    setTimeout(() => {
      this.getInfoTasa();
      this.BankOption();
    }, 4000);

    //EMISION POLIZA
    this.descripcion = JSON.parse(data);

    this.formPolizaData = JSON.parse(
      localStorage.getItem('poliza_data') || '[]'
    );

    const emailInfo: any = JSON.parse(
      localStorage.getItem('auth-session') || '[]'
    );
    const emailData: any = jwtDecode(emailInfo.infoUser);
    this.email = emailData.email;
  }

  togglePaymentFields(event: any): void {
    this.metodoPago = event.target.value;
    this.countOption = this.metodoPago === 'telefono' ? 'CELE' : 'CNTA';
  }

  private generateForm() {
    this.formSyPago = this.fb.group({
      numberCedula: new FormControl('', Validators.required),
      typeCedula: new FormControl('', Validators.required),
      bank_code: new FormControl('', Validators.required),
      numeroCuentaT: new FormControl('', Validators.required),
    });
  }

  private localStorage() {
    const infoPlan: any = localStorage.getItem('infoPlan');
    if (infoPlan) {
      this.data = JSON.parse(infoPlan);
    }
  }

  private async toastMessage(
    message: string,
    color: 'danger' | 'success' | 'warning'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'top',
      color: color,
    });
    await toast.present();
  }

  private async authSyPago() {
    try {
      await this.authService.authToken();
    } catch (error) {
      console.error('Error al obtener el token de autenticación:', error);
    }
  }

  private async getInfoTasa() {
    this.showLoading = true; // Mostrar el indicador de carga al iniciar

    try {
      const response = await this.authService.getTasaBank();

      // Verificar que data y costo_anual existan
      const precio: number = this.data?.costo_anual
        ? Number(this.data.costo_anual)
        : 0;

      // Verificar que monto sea un número válido
      const precioRetorno = isNaN(parseFloat(this.monto))
        ? 0
        : parseFloat(this.monto);

      const tasa = response[0].rate;

      // Calcular precio y payt sólo si tasa es válida
      if (tasa && !isNaN(tasa)) {
        this.precio = (precio * tasa).toFixed(2);
        this.payt = (precioRetorno * tasa).toFixed(2);
        this.pago = (this.precio | this.payt).toFixed(2);
      } else {
        // console.log('Tasa inválida', tasa);
      }
    } catch (error) {
      // console.log('error al obtener la tasa', error);
    } finally {
      this.showLoading = false;
    }
  }
  closeModal() {
    this.isModalVisible = false;
  }

  //EMISION POLIZA
  private getCurrentDate(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  sumarUnAno(): Date {
    const fechaActual = new Date();

    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setFullYear(fechaActual.getFullYear() + 1);

    return nuevaFecha;
  }
  private async emailSend(data: any) {
    localStorage.setItem('Correo_Poliza', JSON.stringify(data));
  }
  private async savePoliza(data: any) {
    await (await this.insertData.savePoliza(data)).toPromise();
  }

  public async submit() {
    this.showLoading = true;
    if (this.formSyPago.valid) {
      try {
        await this.authSyPago();
        this.paymentData = {
          creditor_account: {
            bank_code: this.codeBank,
            type: 'CNTA',
            number: this.countBank,
          },
          debitor_document_info: {
            type: this.formSyPago.get('typeCedula')?.value,
            number: this.formSyPago.get('numberCedula')?.value,
          },
          debitor_account: {
            bank_code: this.formSyPago.get('bank_code')?.value,
            type: this.countOption,
            number: this.formSyPago.get('numeroCuentaT')?.value,
          },
          amount: {
            amt: parseFloat(this.pago),
            currency: 'VES',
          },
        };

        await this.authService.realizarPago(this.paymentData);
        this.isModalVisible = true;

        // try {
        //   const response = await (
        //     await this.polizaService.emisionMundial(this.formPolizaData.value)
        //   ).toPromise();

        //   if (response.status === true) {
        //     const cnpoliza = response.data.cnpoliza;
        //     localStorage.setItem('cnpoliza', JSON.stringify(cnpoliza));
        //     const urlpoliza = response.data.urlpoliza;
        //     const plan = this.descripcion;
        //     const fecha_inicio = this.getCurrentDate();
        //     const numeroPoliza = this.formPolizaData.poliza;
        //     const fechaVencimiento = this.sumarUnAno();

        //     await this.emailSend({
        //       correo_titular: this.formPolizaData.correo_titular,
        //       poliza: cnpoliza,
        //       fecha_emision: this.formPolizaData.fecha_emision,
        //       nombre_titular: this.formPolizaData.nombre_titular,
        //       fecha_cobro: plan,
        //       urlpoliza: urlpoliza,
        //       fecha_inicio: fecha_inicio,
        //       numero_Poliza: numeroPoliza,
        //       fecha_vencimiento: fechaVencimiento,
        //     });

        //     setTimeout(() => {
        //       this.savePoliza({
        //         fecha_emision: this.getCurrentDate(),
        //         fecha_expiracion: this.sumarUnAno(),
        //         estado_poliza: 'PENDIENTE',
        //         documento_poliza: urlpoliza,
        //         email_usuario: this.email,
        //         coberturas: {
        //           Cobertura_Total: '1000',
        //         },
        //         plan: 'Gastos funerarios',
        //         monto: '9',
        //         titular: this.formPolizaData.nombre_titular,
        //         aseguradora: 'La mundial de Seguros',
        //         numero_poliza: cnpoliza,
        //         titular_apellido: this.formPolizaData.apellido_tomador,
        //       });
        //     }, 1000);

        //     setTimeout(() => {
        //       this.toastMessage(
        //         'Datos Enviados perfectamente 😁, en breve será redirigido',
        //         'success'
        //       );
        //       this.navCtrl.navigateRoot('1d4c5e7b3f9a8e2a6b0d9f3c7a1b4e8');
        //     }, 2000);
        //   } else {
        //     if (
        //       response.message ===
        //       'Se ha detectado la existencia de una póliza vigente con el mismo asegurado y ramo.'
        //     ) {
        //       this.toastMessage(
        //         'Estimado usuario la póliza ya se encuentra registrada 😰.',
        //         'danger'
        //       );
        //     }
        //     this.showLoading = false;
        //   }
        // } catch (err) {
        //   if (err instanceof HttpErrorResponse) {
        //     if (
        //       err.status === 500 &&
        //       err.error.message ===
        //         'Se ha detectado la existencia de una póliza vigente con el mismo asegurado y ramo.'
        //     ) {
        //       this.toastMessage(
        //         'Estimado usuario la póliza ya se encuentra registrada 😰, por favor intente de nuevo',
        //         'danger'
        //       );
        //     } else if (
        //       err.status === 500 &&
        //       err.error.message ===
        //         'El asegurado/titular no cumple con los criterios de edad para este plan. (Min: 0  , Max: 70 ).'
        //     ) {
        //       this.toastMessage(
        //         'El asegurado/titular no cumple con los criterios de edad para este plan. (Min: 0  , Max: 70 )',
        //         'warning'
        //       );
        //     }
        //   }
        //   this.showLoading = false;
        // } finally {
        //   this.showLoading = false;
        // }
      } catch (error) {
        console.error('Error al procesar el OTP:', error);
        this.toastMessage(
          'Hubo un error al procesar el pago. Inténtelo nuevamente.',
          'danger'
        );
      } finally {
        this.showLoading = false;
      }
    } else {
      // this.isModalVisible = true
      this.formSyPago.markAllAsTouched();
      this.toastMessage('Completa todos los campos 😰, por favor', 'danger');
      this.showLoading = false;
    }
  }

  public async BankOption() {
    try {
      const response = await this.authService.bankOptions();
      this.bank = response.filter(
        (item: { IsDebitOTP: any }) => item.IsDebitOTP
      );
    } catch (error) {
      console.error('Error al obtener las opciones de banco:', error);
    }
  }
}
