import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { InserDataService } from 'src/app/services/inser-data.service';
import { PolizaService } from 'src/app/services/poliza.service';
import { SypagoService } from 'src/app/services/sypago.service';
import { environment } from 'src/environments/environment';
import {jwtDecode} from 'jwt-decode'
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {

  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Input() paymentData: any;
  otp: string[] = [];
  otpLength: number = 6;
  private sypagoService = inject(SypagoService);
  private toastController = inject (ToastController)
  private navCtrl = inject (NavController )
  private mundialService = inject (PolizaService);
  private insertDataService = inject(InserDataService);
  private NotificationService = inject(NotificationService);
  private http = inject( HttpClient)
  showLoading = false;
  private countBank : string = '01720111531118494549'; 
  //private countBank : string = '01143600524083976037';
  private codeBank : string = '0172'
 //private codeBank : string = '0114'
  private idcout = 1;
  private idtransaction: string = '';
  private opt: any;
  private route : any
  private numero_Poliza : any;
  private email !: any;
  private planSend : any
  private id :any
  private numeroObtenido : any
  private numeroPoliza : any
  private poliza : any
  private statusPoliza : any
  ngOnInit() {
    const info = JSON.parse(localStorage.getItem('Descripcion_products') || '[]');
    this.planSend = info;
    const numero : any = localStorage.getItem('currentPolizaNumber')
    this.numero_Poliza = JSON.parse(numero)
    const data : any = localStorage.getItem('id-routing')
    this.route = JSON.parse(data)
    this.id  = JSON.parse(localStorage.getItem('cnpoliza') || '[]');    
    this.numeroObtenido = JSON.parse(localStorage.getItem('numero') || '[]')
    this.setOtpLength(8);
    this.storaged();
    const numeroPoliza : any = JSON.parse(localStorage.getItem('Correo_Poliza') || '[]');
   this.numeroPoliza = numeroPoliza.poliza 
    this.statusPoliza = numeroPoliza.numero_poliza
   const paymentRetorno = JSON.parse(localStorage.getItem('paymentRetorno') || '[]')
   this.poliza = paymentRetorno.numero_poliza
  } 

  setOtpLength(length: number, event?: Event) {
    if (event) {
        event.stopPropagation();
    }
    this.otpLength = length;
    this.otp = Array(length).fill('');
  }

  private async toastMessage(message: string, color: 'danger' | 'success' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3500,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  close() {
    this.clearOtp();
    this.closeModal.emit();
  }

  moveFocus(event: any, nextInputId: string) {
    const currentInput = event.target as HTMLInputElement;
    const value = currentInput.value;

    // Mover el foco si el campo actual tiene un valor
    if (value.length === 1) {
      const nextInput = document.querySelector(`#${nextInputId}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }


  private storaged() {
  const data = localStorage.getItem('auth-session');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        const info: any = jwtDecode(parsedData.infoUser)
        this.email = info.email
      } catch (error) {
        console.error('Error al decodificar el token JWT o al parsear los datos:', error);
      }
    } else {
      console.warn('No se encontró ningún dato en localStorage con la clave "auth-session".');
    }
  }
  

  handleBackspace(event: any, currentInputId: string) {
    const currentInput = event.target as HTMLInputElement;

    // Detectar si se presiona la tecla de retroceso (Backspace) y el campo está vacío
    if (event.key === 'Backspace' && currentInput.value.length === 0) {
      const currentIndex = parseInt(currentInputId.replace('otp', ''), 10) - 1;
      if (currentIndex > 0) {
        const prevInputId = 'otp' + currentIndex;
        const prevInput = document.querySelector(`#${prevInputId}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          this.otp[currentIndex - 1] = '';
        }
      }
    }
  }

  clearOtp() {
    this.otp = Array(this.otpLength).fill('');
  }

  sumarUnAno(): Date {
    const fechaActual = new Date();
  
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setFullYear(fechaActual.getFullYear() + 1);
  
    return nuevaFecha;
  }


  private async mundialRegisterPayment(){
    const datos = {
      poliza:this.numeroObtenido,
      recibo:this.idtransaction,
      monto: this.paymentData.amount.amt,
      referencia:this.idtransaction,
      moneda:'BS',
      fecha_cobro:this.getCurrentDate()
    }    
    const response = await (await this.mundialService.registerMundialPayment(datos)).toPromise()     
  }

  public async Submit() {
    this.showLoading = true;
    const otpCode = this.otp.join('').trim(); 
    
    if (otpCode.length !== this.otpLength) {
      alert(`El código OTP debe tener exactamente ${this.otpLength} dígitos.`);
      this.showLoading = false;
      return;
    }
  
    const datos = {
      "internal_id": this.numeroPoliza || this.poliza,
      "group_id": this.numeroPoliza || this.poliza,
      "account": {
        "bank_code": this.codeBank,
        "type": "CNTA",
        "number": this.countBank
      },
      "amount": {
        "amt": this.paymentData.amount.amt,
        "currency": "VES"
      },
      "concept": "Cobro de Poliza",
      "notification_urls": {
        "web_hook_endpoint": 'https://syPagoMundial.polizaqui.com/getNotifications'
      },
      "receiving_user": {
        "otp": otpCode,
        "document_info": {
          "type": this.paymentData.debitor_document_info.type,
          "number": this.paymentData.debitor_document_info.number
        },
        "account": {
          "bank_code": this.paymentData.debitor_account.bank_code,
          "type": this.paymentData.debitor_account.type,
          "number": this.paymentData.debitor_account.number
        }
      }
    };
  
    try {
      const response = await firstValueFrom(this.sypagoService.verifyCodeOTP(datos));
      this.idtransaction = response.transaction_id;
      this.getNortifications();
    } catch (error) {
      this.toastMessage('Hubo un error al procesar el OTP, intenta nuevamente', 'danger');
      this.showLoading = false
    }
  }
  
  isOtpComplete(): boolean {
    return this.otp.length === this.otpLength && this.otp.every(value => value !== '');
  }

  private getNortifications() {
    const datos = {
      id_transaction: this.idtransaction
    };
  
    // Crear un intervalo para verificar el estado cada 10 segundos
    const interval = setInterval(() => {
      this.sypagoService.getNotification(datos).subscribe(data => {
        
        switch (data.data.status) {
          case "ACCP":
            this.updatePoliza();
             this.registerPayment();
            this.getPolizaCorreo();
            this.sendDataService('');
            this.requestNotification();
            this.toastMessage('Pago realizado exitosamente, verifica tu correo', 'success');
            this.mundialRegisterPayment();
            setTimeout(() => {
              this.navCtrl.navigateRoot('7f7d9e3d1e7b5f6a9c8b4a9d4c9d2e4a');
            }, 4000);
  
            clearInterval(interval);
            break;
  
          case "RJCT":
            this.toastMessage('Operación rechazada. Por favor, revisa los detalles e inténtalo de nuevo.', 'danger');
            this.registerPayment1();
            this.showLoading = false;
            this.close();
            clearInterval(interval); // Detener el temporizador si la transacción es rechazada
            break;
  
          case "PEND":
            // this.toastMessage('Pago pendiente. Recibirás una notificación una vez completado.', 'warning');
            // this.registerPayment2()
            this.showLoading = true;
            break;
  
          case 'PROC':
            // this.toastMessage('Pago en proceso. Recibirás una notificación una vez completado.', 'warning');
            this.showLoading = true;
            break;
  
          default:
            this.toastMessage('Estado de la operación desconocido. Contacte soporte.', 'danger');
            clearInterval(interval);
            break;
        }
      });
    }, 10000); // Repetir cada 10 segundos
  }
  
  requestNotification(): void {
    const notificationData = {
      title: '¡Gracias por Preferir PolizAqui! 😁',
      message: `Estimado usuario, su pago fue procesado con exito, no olvides descargar tu póliza`,
    };
    this.NotificationService.sendNotification(notificationData);
  }


  private async updatePoliza() {
    const dato = {
      numero_poliza:this.numeroPoliza || this.statusPoliza
    }
    const response =  await this.insertDataService.updateStatus(dato);
  }
  
  private async getPolizaCorreo(){
    try {
        const correo = localStorage.getItem('Correo_Poliza');
        if (!correo) {
            return;
        }
        const correoData = JSON.parse(correo);
        const result = await this.http.post<any>(`${environment.mailPoliza}/send`, correoData).toPromise();
        localStorage.setItem('poliza', JSON.stringify(result));
    } catch(err) {
    }
}


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
  
  private async registerPayment() {
    const dataEmpresa = JSON.parse(localStorage.getItem('empresa-aliada') || '')
    const data = {
      numero_poliza: this.id,
      monto_pago: this.paymentData.amount.amt,
      fecha_pago: this.getCurrentDate(),
      metodo_pago: this.paymentData.debitor_account.type,
      referencia: this.idtransaction,
      banco: this.paymentData.debitor_account.number,
      sypago: this.paymentData,
      transaction_id: this.idtransaction,
      status: true,
      email: this.email,
      aliado: 'La Mundial',
      plan: this.planSend,
      estado:'PAGADA',
      empresa: dataEmpresa || 'PolizAqui'
    };
    
    try {
      const response = await  this.sypagoService.registerPayment(data);
    } catch (error) {
      console.error('Error durante el registro del pago:', error);
    }
  }

  private async registerPayment1() {

    const data = {
      numero_poliza: this.id,
      monto_pago: this.paymentData.amount.amt,
      fecha_pago: this.getCurrentDate(),
      metodo_pago: this.paymentData.debitor_account.type,
      referencia: this.idtransaction,
      banco: this.paymentData.debitor_account.number,
      sypago: this.paymentData,
      transaction_id: this.idtransaction,
      status: true,
      email: this.email,
      aliado: 'La Mundial',
      plan: this.planSend,
      estado:'RECHAZADA'
    };
    
    try {
      const response = await  this.sypagoService.registerPayment(data);
    } catch (error) {
      console.error('Error durante el registro del pago:', error);
    }
  }


  private async sendDataService(data: any) {
    const datos = {
      tipo_transaccion: this.getTipoTransaccion(this.paymentData.debitor_account.type),
      fecha_transaccion: this.getCurrentDate(),
      monto_transaccion: this.paymentData.amount.amt,
    };
    try {
      const response = await this.insertDataService.saveTransactions(datos);
    } catch (error) {
      console.error('Error al guardar la transacción:', error);
    }
  }

  getTipoTransaccion(type:any) {
    switch (type) {
      case 'CELE':
        return 'Pago Móvil';
      case 'CNTA':
        return 'Cuenta Bancaria';
      default:
        return 'Desconocido'; // Valor por defecto en caso de un tipo no reconocido
    }
  }
}
