import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  /********
   * variables consecutivas
   ********/

  formRegister!: FormGroup;
  title: string = "Regístrate";
  passwordFieldType: string = 'password';
  passwordIcon: string = 'eye-off'; 
  showLoading: boolean = false;
  private fb = inject ( FormBuilder );
  private toastContoller = inject ( ToastController );
  private navCtrl = inject( NavController );
  private authService = inject ( AuthService );
  private notificationService = inject ( NotificationService );
  verificarCorreoControl: FormControl = new FormControl(''); // Control separado para "verificar correo"
  correoNoCoincide: boolean = false; // Variable para el error de coincidencia
  correoCoincide: boolean = false
  isSecondCheckboxChecked = false;


  verificarCoincidencia(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const correoVerificado = inputElement.value;
    
    const correoTomador = this.formRegister.get('email')?.value;
    
    // Verificar si los correos coinciden
    this.correoNoCoincide = correoTomador !== correoVerificado;
    this.correoCoincide = correoTomador === correoVerificado; // Nueva propiedad para el éxito
  }

  constructor() {
    this.initializeForm();
   }

  
  private initializeForm() {
    this.formRegister = this.fb.group({
      nombre:   ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email:    ['', [Validators.required, Validators.email]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^(0414|0416|0424|0426|0412)-\d{7}$/)
      ]],     
      password: ['', [Validators.required, Validators.minLength(6)]],
      provider: [''],
      provider_id: [''],
    });
  }

  /********
   * show password
   *******/

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordFieldType === 'password' ? 'eye-off' : 'eye';
  }

  /*******
   * getters
   ******/

  get nameControl(): AbstractControl<any, any> {
    return this.formRegister.get('nombre')!;
  }

  get apellidoControl(): AbstractControl<any, any> {
    return this.formRegister.get('apellido')!;
  }

  get telefonoControl(): AbstractControl<any, any> {
    return this.formRegister.get('telefono')!;
  }

  get emailControl(): AbstractControl<any, any> {
    return this.formRegister.get('email')!;
  }

  get passwordControl(): AbstractControl<any, any> {
    return this.formRegister.get('password')!;
  }

  /*******
   * toastMessage
   ******/

  private async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastContoller.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  /********
   * routingNavigate
   *******/

  public routingNavigate() {
    return this.navCtrl.navigateRoot('b4d9ef72dc4a9b91e8a1d6b9d1a423a7')
  }

  public loginWithGoogle() {
    this.showLoading = true;
    if(window.onoffline){
      this.showLoading = false;
      this.presentToast('En este momento no tienes conexión a la red, intenta nuevamente','warning')
    }else{
     this.authService.googleAuthentication()
    }
  }

  public loginWithFacebook() : void {
    this.showLoading = true
    if(window.onoffline) {
      this.showLoading = false;
      this.presentToast('En este momento no tienes conexión a la red, intenta nuevamente','warning')
    }else{
      this.authService.facebookAuthentication();
    }
  }

  /*********
   * Submit
   ********/

  public async Submit() {
    this.showLoading = true;
    if (this.formRegister.valid) {
      (await this.authService.registerAuthentication(this.formRegister.value)).pipe(
        catchError((err: HttpErrorResponse) => {
          this.showLoading = false;
          if (err.error && err.error.message === 'User Already Registered') {
            this.presentToast('El usuario ya se encuentra registrado ☹️, por favor intente de nuevo', 'warning');
          } else {
            this.presentToast('El usuario ya se encuentra registrado ☹️, por favor intente de nuevo', 'warning');
          }
          return throwError(err);
        })
      ).subscribe(response => {
        this.showLoading = false;
        if (response.code === 200) {
          this.presentToast('El registro fue exitoso 😁, en breve será redirigido', 'success');
          this.requestNotification();
          setTimeout(() => {
            return this.navCtrl.navigateRoot('b4d9ef72dc4a9b91e8a1d6b9d1a423a7');
          }, 2500);
        }
      });
    } else {
      if (this.passwordControl.errors?.['minlength']) {
        this.presentToast('La contraseña debe tener al menos 6 caracteres 😰', 'danger');
      } else {
        this.presentToast('Por favor, completa los campos obligatorios 😰', 'danger');
      }
      setTimeout(() => {
        this.showLoading = false;
      }, 2500);
    }
  }

  /********
   * sendNotfication
   *******/

  private async requestNotification() {
    const notificationData = {
      title: 'PolizAqui te informa 📢',
      message: '¡Gracias por confiar en nosotros! tu registro fue todo un exito'
    }
    return await this.notificationService.sendNotification(notificationData);
  }

  ngOnInit() {
  }

}
