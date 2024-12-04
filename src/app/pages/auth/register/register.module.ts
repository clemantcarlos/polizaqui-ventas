import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    DefaultSharedModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers:[AuthService,NotificationService],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
