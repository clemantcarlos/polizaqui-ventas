import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  /*******
   * variables consecutivas
   *******/

  private fb = inject( FormBuilder );
  private activateRoute = inject(ActivatedRoute)
  private toastCtrl = inject( ToastController );
  private navCtrl = inject( NavController );
  private authService = inject( AuthService );
  private notificationService = inject( NotificationService );
  private email !: any;
  public showLoading = false;
  title:string='Confirmar contraseña';
  formGenerate!:FormGroup;
  passwordFieldType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor() {
    this.generateForm();
   }

  private generateForm() : void {
    this.formGenerate = this.fb.group({
      password:['',Validators.required],
      email:['']
    })
  }

  /*******
   * show password
   ******/

  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordFieldType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  /**********
   * toastController
   *********/

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color,
    });
    toast.present();
  }


  /*********
   * RoutingNavigate
   ********/

  public async Submit() {
    this.showLoading = true;
    if(this.formGenerate.valid){
      (await this.authService.forgotPasswordd(this.formGenerate.value)).pipe(
        catchError((err:HttpErrorResponse) => {
          this.showLoading = false;
          if(err.status === 500){
            this.presentToast('No se pudo Actualizar la Contraseña 😰, por favor intenta de nuevo','danger')
          } else {
            this.presentToast('Ocurrio un error Intentalo Nuevamente','danger')
          }
          return throwError(err);
        })
      ).subscribe(response => {
        this.showLoading = false;
        this.presentToast('La contraseña fue actaulizada exitosamente 😁, en breve sera redirigido','success');
        this.requestNotification();
        setTimeout(() => {
          return this.navCtrl.navigateRoot('b4d9ef72dc4a9b91e8a1d6b9d1a423a7')
        }, 3000);
      })
    }else {
      this.presentToast('Por favor, completa los campos obligatorios 😰','danger');   
      setTimeout(() => {
        this.showLoading = false;
      }, 2500);
    } 
  }

  /*********
   *  notificationService
   ********/

  private async requestNotification() {
    const notificationData = {
      title: 'PolizAqui te informa 📢',
      message: '¡Gracias por confiar en nosotros! Tu contraseña fue actualizada con exito'
    }
    return await this.notificationService.sendNotification(notificationData);
  }

  ngOnInit() {
    this.email = this.activateRoute.snapshot.paramMap.get('email');
    setTimeout(() => {
      this.formGenerate.get('email')?.setValue(this.email)    
    }, 2000);
  }

  

}
