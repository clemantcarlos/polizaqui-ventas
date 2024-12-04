import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { log } from 'console';
import { bankOption, PLan } from 'src/app/interface/syPagoBank';
import { OccidentalService } from 'src/app/services/occidental.service';
import { SypagoService } from 'src/app/services/sypago.service';

@Component({
  selector: 'app-pago-occidental',
  templateUrl: './pago-occidental.page.html',
  styleUrls: ['./pago-occidental.page.scss'],
})
export class PagoOccidentalPage implements OnInit {
 
  metodoPago: string = '';
  countOption: string = '';
  private occidentalService = inject( OccidentalService );
  private authService = inject (SypagoService)
  public data: PLan | null = null;
  public formSyPago!: FormGroup;
  private fb = inject( FormBuilder );
  public showLoading = false;
  private toastController = inject ( ToastController );
  isModalVisible: boolean = false;
  paymentData: any;
  public precio : any;
  public Descripcion_occidental :any
  public dataOtp : any
  /********* BANK MUNDIAL *******/
  public bank : bankOption [] = [];

  constructor() {this.generateForm()}

  ngOnInit() {
    this.getStoragedData()
    setTimeout(() => {
      this.BankOption();
    }, 4000);
    const info = JSON.parse(localStorage.getItem('cedula-payment') || '[]')
    this.formSyPago.patchValue({
        numid:info
    })
  }

  togglePaymentFields(event: any): void {
    this.metodoPago = event.target.value;
    this.countOption = this.metodoPago === 'telefono' ? 'CELE' : 'CNTA';
    this.formSyPago.get('type_inst')?.setValue(this.countOption) 
  }

  private generateForm() {
    this.formSyPago = this.fb.group({
      idepol : new FormControl (''),
      numpol: new FormControl (''),
      codinter: new FormControl ('060001'),
      typeid: new FormControl ('',Validators.required),
      numid: new FormControl ('',Validators.required),
      type_inst : new FormControl (''),
      instrument: new FormControl ('',Validators.required),
      bank_code: new FormControl ('',Validators.required),
      pay_amt: new FormControl (''),
      currency: new FormControl ('VES')
    })
  }

  private getStoragedData() : void {
    const dataPrecio = JSON.parse(localStorage.getItem('price') || '[]');
    this.Descripcion_occidental = JSON.parse(localStorage.getItem('plan') || '[]');
    const idP = JSON.parse(localStorage.getItem('occidental_poliza') || '[]');
    this.precio = parseInt(idP.prima, 10);
    console.log(this.precio);
    
    this.formSyPago.get('pay_amt')?.setValue(this.precio)
    this.formSyPago.get('idepol')?.setValue(idP.idepol)
    this.formSyPago.get('numpol')?.setValue(idP.numpol)
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

  closeModal() {
    this.isModalVisible = false;
  }
    public async submit() {
      this.showLoading = true;
      if (this.formSyPago.valid) {
        try {
          this.dataOtp = this.formSyPago.value
          const response = await (await this.occidentalService.getSavePayment(this.formSyPago.value)).toPromise();
            this.isModalVisible = true
        } catch (error) {
          console.error('Error al procesar el OTP:', error);
          this.toastMessage('Hubo un error al procesar el OTP. Inténtelo nuevamente.', 'danger');
        } finally {
          this.showLoading = false;
        }
      } else {
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
