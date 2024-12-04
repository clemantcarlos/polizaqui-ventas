import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  /********
   * variables consecutivas
   *******/

  title:string='Recuperar Contraseña';
  formForgot!:FormGroup;
  private fb = inject( FormBuilder );
  public ShowLoading : boolean = false;
  private toastController = inject( ToastController );
  private notificationService = inject( NotificationService );
  private passwordService = inject( PasswordService );

  constructor() {
    this.generateForm();
   }

  private generateForm() {
    this.formForgot = this.fb.group({
      email:['',[Validators.required,Validators.email]]
    })
  }

  /*******
   * toastController
   ******/

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color,
    });
    toast.present();
  }

  /********
   * sendPassword
   *******/

  public async Submit() {
    this.ShowLoading = true;
    if(this.formForgot.valid){
       this.passwordService.forgotPassword(this.formForgot.value).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status === 404 && err.error){
            this.ShowLoading = false;
            this.presentToast('No se pudo encontrar el usuario 😰, por favor intenta de nuevo','danger')
          } else {
            this.presentToast('Ocurrio un Error Intentelo de nuevo','danger')
          }
          return throwError(err)
        })
      ).subscribe(response => {
        this.ShowLoading = false;
        if(response.code === 200) {
          this.presentToast('Hemos enviado un correo con las instrucciones para restablecer tu contraseña 😁','success');
          this.requestNotification();
        }
      })
    }
  }


  /**********
   * notificationService
   ********/

  private async requestNotification() {
    const notificationData = {
      title: 'PolizAqui te informa 📢',
      message: '¡Gracias por confiar en nosotros! Hemos enviado un correo con las instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada para continuar con el proceso. ¡Te deseamos una excelente experiencia!'
    }
    return await this.notificationService.sendNotification(notificationData);
  }
  

  ngOnInit() {
  }

}
