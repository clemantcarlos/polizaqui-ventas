import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { log } from 'console';
import { bankOption, PLan } from 'src/app/interface/syPagoBank';
import { SypagoService } from 'src/app/services/sypago.service';

@Component({
  selector: 'app-pago-mundial',
  templateUrl: './pago-mundial.page.html',
  styleUrls: ['./pago-mundial.page.scss'],
})
export class PagoMundialPage implements OnInit {

  
  metodoPago: string = '';
  countOption: string = '';
  private authService = inject( SypagoService );
  public data: PLan | null = null;
  public formSyPago!: FormGroup;
  private fb = inject( FormBuilder );
  public showLoading = false;
  private toastController = inject ( ToastController );
  isModalVisible: boolean = false;
  paymentData: any;
  /********* BANK MUNDIAL *******/
  private countBank : string = '01720111531118494549'; 
  //private countBank : string = '01143600524083976037';
  private codeBank : string = '0172'
  //private codeBank : string = '0114'
  public bank : bankOption [] = [];
  info:any
  price: any
  precio:any
  monto:any
  plan : any
  payt:any
  pago:any

  constructor() {this.authSyPago(),this.generateForm()}

  ngOnInit() {
    this.localStorage();
    const data : any = localStorage.getItem('Descripcion_products')
    const pricee : any = localStorage.getItem('price')
    const datainfo = JSON.parse(localStorage.getItem('paymentRetorno') || '[]')
    this.monto = datainfo.monto;
    this.plan = datainfo.plan;
    this.info = JSON.parse(data)
    this.price = JSON.parse(pricee)
    setTimeout(() => {
      this.getInfoTasa()
      this.BankOption();
    }, 4000);
  }

  togglePaymentFields(event: any): void {
    this.metodoPago = event.target.value;
    this.countOption = this.metodoPago === 'telefono' ? 'CELE' : 'CNTA';
  }

  private generateForm() {
    this.formSyPago = this.fb.group({
      numberCedula : new FormControl ('',Validators.required),
      typeCedula: new FormControl ('',Validators.required),
      bank_code: new FormControl ('',Validators.required),
      numeroCuentaT: new FormControl ('',Validators.required)
    })
  }

  private localStorage() {
    const infoPlan: any = localStorage.getItem('infoPlan');  
    if (infoPlan) {
      this.data = JSON.parse(infoPlan);  
          console.log(this.data);
          
    }
  }

  private async toastMessage(message: string, color: 'danger' | 'success' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  private async authSyPago() {
    try {
      const response = await this.authService.authToken();
    } catch (error) {
      console.error('Error al obtener el token de autenticación:', error);
    }
  }


  private async getInfoTasa() {
    this.showLoading = true; // Mostrar el indicador de carga al iniciar
  
    try {
      const response = await this.authService.getTasaBank();
      console.log(response);
  
      // Verificar que data y costo_anual existan
      const precio: number = this.data?.costo_anual ? Number(this.data.costo_anual) : 0;
  
      // Verificar que monto sea un número válido
      const precioRetorno = isNaN(parseFloat(this.monto)) ? 0 : parseFloat(this.monto);
  
      const tasa = response[0].rate;
  
      // Calcular precio y payt sólo si tasa es válida
      if (tasa && !isNaN(tasa)) {
        this.precio = (precio * tasa).toFixed(2);
        this.payt = (precioRetorno * tasa).toFixed(2);
        this.pago = (this.precio | this.payt).toFixed(2);
      } else {
        console.log('Tasa inválida', tasa);
      }
  
    } catch (error) {
      console.log('error al obtener la tasa', error);
    } finally {
      this.showLoading = false;
    }
  }
  
  



  closeModal() {
    this.isModalVisible = false;
  }
    public async submit() {
      this.showLoading = true;
      if (this.formSyPago.valid) {
        try {
          await this.authSyPago();
          this.paymentData = {
            "creditor_account": {
              "bank_code": this.codeBank,
              'type': 'CNTA',
              "number": this.countBank
            },
            "debitor_document_info": {
              'type': this.formSyPago.get('typeCedula')?.value,
              'number': this.formSyPago.get('numberCedula')?.value
            },
            "debitor_account": {
              "bank_code": this.formSyPago.get('bank_code')?.value,
              "type": this.countOption,
              "number": this.formSyPago.get('numeroCuentaT')?.value
            },
            "amount": {
              "amt": parseFloat(this.pago),
              "currency": "VES"
            }
          };

          const response = await this.authService.realizarPago(this.paymentData);
            this.isModalVisible = true
                      
        } catch (error) {
          console.error('Error al procesar el OTP:', error);
          this.toastMessage('Hubo un error al procesar el pago. Inténtelo nuevamente.', 'danger');
        } finally {
          this.showLoading = false;
        }
      } else {
        // this.isModalVisible = true
        this.formSyPago.markAllAsTouched()
        this.toastMessage('Completa todos los campos 😰, por favor', 'danger');
        this.showLoading = false;
      }
    }
    

  public async BankOption() {
    try {
      const response = await this.authService.bankOptions();
      this.bank = response.filter((item: { IsDebitOTP: any; }) => item.IsDebitOTP);
    } catch (error) {
      console.error('Error al obtener las opciones de banco:', error);
    }
  }
  
  
}
