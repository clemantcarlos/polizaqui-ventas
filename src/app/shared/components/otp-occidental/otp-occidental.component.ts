import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';
import { OccidentalService } from 'src/app/services/occidental.service';
import { SypagoService } from 'src/app/services/sypago.service';

@Component({
  selector: 'app-otp-occidental',
  templateUrl: './otp-occidental.component.html',
  styleUrls: ['./otp-occidental.component.scss'],
})
export class OtpOccidentalComponent  implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Input()  dataOtp:any;
  otp: string[] = [];
  otpLength: number = 6;
  private toastController = inject (ToastController)
  private navCtrl = inject (NavController )
  private occidentalService = inject (OccidentalService)
  private NotificationService = inject (NotificationService)
  private sypagoService = inject( SypagoService );
  showLoading = false;
  private idtransaction : any
  private data: any;
  private poliza : any; 
  ngOnInit() {
    this.setOtpLength(8);   
    this.data = JSON.parse(localStorage.getItem('Correo_Poliza') || '[]')
    console.log(this.data);
    
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
      duration: 2500,
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

  handleBackspace(event: any, currentInputId: string) {
    const currentInput = event.target as HTMLInputElement;
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

  public async Submit() {
    this.showLoading = true;
    const otpCode = this.otp.join('').trim(); 
    
    if (otpCode.length !== this.otpLength) {
      alert(`El código OTP debe tener exactamente ${this.otpLength} dígitos.`);
      return;
    }
  
    try {
      const data  = {
        idepol:this.dataOtp.idepol,
        numpol: this.dataOtp.numpol,
        codinter:this.dataOtp.codinter,
        typeid:this.dataOtp.typeid,
        numid:this.dataOtp.numid,
        type_inst:this.dataOtp.type_inst,
        instrument:this.dataOtp.instrument,
        bank_code:this.dataOtp.bank_code,
        pay_amt:this.dataOtp.pay_amt,
        currency:this.dataOtp.currency,
        code_OTP:otpCode,
        client_name:'PolizAqui'
      }
     const response = await ( await this.occidentalService.postPayment(data)).toPromise();     
      this.idtransaction = response.transaction_Id     
      console.log(response);
       
     this.getNortifications();
    } catch (error) {
      console.error('Error durante la verificación del OTP o el registro del pago:', error);
    } 
  }

  isOtpComplete(): boolean {
    return this.otp.length === this.otpLength && this.otp.every(value => value !== '');
  }

  private getNortifications() {
    const datos = {
      transaction_ID:this.idtransaction
    };
    this.occidentalService.verifyPayment(datos).subscribe(data => {      
      switch (data.status) {
        case "ACCP":
          this.previewPoliza();     
          setTimeout(() => {
            this.registerPayment();
            this.toastMessage('Pago realizado exitosamente, verifica tu correo', 'success');
       
            this.requestNotification()
            this.navCtrl.navigateRoot('confirmacion-occidental');
          }, 8000);
          break;
  
        case "RJCT":
          this.toastMessage('Operación rechazada. Por favor, revisa los detalles e inténtalo de nuevo.', 'danger');
          this.showLoading = false
          this.close()
          break;
  
        case "PEND":
          this.toastMessage('Pago pendiente. Recibirás una notificación una vez completado.', 'warning');
          break;

          case 'PROC':
            this.toastMessage('Pago en proceso. Recibirás una notificación una vez completado.', 'warning');
            break;
  
        default:
          this.toastMessage('Estado de la operación desconocido. Contacte soporte.', 'danger');
          break;
      }
    });
  }

  private async previewPoliza() {
    try{
      const data = {
        idepol: this.dataOtp.idepol,
        canal:'MOBILE'
      }
      const response = await this.occidentalService.viewPoliza(data).toPromise();  
      console.log(response);
      
      this.poliza = response.downloadLink
      localStorage.setItem('poliza',JSON.stringify(this.poliza))
      this.sendPoliza();
    }catch(err){

    }
  }

  private async  sendPoliza(){
    const data = {
      correo_titular: this.data.correo_titular,
      poliza: this.data.numero_poliza,
      fecha_emision: this.data.fecha_emision,
      nombre_titular: this.data.nombre_titular,
      fecha_cobro: this.data.fecha_cobro,
      urlpoliza: this.poliza,
      fecha_inicio: this.data.fecha_inicio,
      numero_Poliza: this.data.numero_Poliza,
      fecha_vencimiento: this.data.fecha_vencimiento,
    }

    const response = await this.occidentalService.sendMail(data).toPromise();
    console.log(response);
    
  }
  
  private requestNotification(): void {
    const notificationData = {
      title: 'PolizAqui te informa 📢',
      message: `¡Pago recibido! Tu póliza está ahora activa. Consulta tu correo para más detalles.`
     };
    this.NotificationService.sendNotification(notificationData);
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
    const data = {
      numero_poliza: parseInt(this.dataOtp.numpol),
      monto_pago: this.dataOtp.pay_amt,
      fecha_pago: this.getCurrentDate(),
      metodo_pago: this.dataOtp.type_inst,
      referencia: this.idtransaction,
      banco: this.dataOtp.instrument,
      sypago: this.dataOtp,
      transaction_id: this.idtransaction,
      status: true,
      email: this.data.correo_titular,
      aliado: 'La Occidental',
      plan: 'RCV AUTO'
    };

    try {
      // Enviar los datos al backend
      const response = await this.occidentalService.registerPayment(data).toPromise();
      console.log('Pago registrado con éxito en la base de datos:', response);
    } catch (error) {
      console.error('Error durante el registro del pago:', error);
    }
  }


  getTipoTransaccion(type:any) {
    switch (type) {
      case 'CELE':
        return 'Pago Móvil';
      case 'CNTA':
        return 'Cuenta Bancaria';
      default:
        return 'Desconocido';
    }
  }

}
