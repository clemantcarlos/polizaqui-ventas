import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordPageRoutingModule } from './password-routing.module';

import { PasswordPage } from './password.page';
import { DefaultSharedModule } from "../../../shared/module/default-shared.module";
import { PasswordService } from 'src/app/services/password.service';
import { NotificationService } from 'src/app/services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordPageRoutingModule,
    DefaultSharedModule,
    ReactiveFormsModule
],
  providers:[PasswordService,NotificationService],
  declarations: [PasswordPage]
})
export class PasswordPageModule {}
