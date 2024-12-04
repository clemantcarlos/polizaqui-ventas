import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoMundialPageRoutingModule } from './pago-mundial-routing.module';

import { PagoMundialPage } from './pago-mundial.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';
import { OtpComponent } from 'src/app/shared/components/otp/otp.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoMundialPageRoutingModule,
    ReactiveFormsModule,
    DefaultSharedModule
  ],
  declarations: [PagoMundialPage,OtpComponent]
})
export class PagoMundialPageModule {}
