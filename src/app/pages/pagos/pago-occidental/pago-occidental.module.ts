import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoOccidentalPageRoutingModule } from './pago-occidental-routing.module';

import { PagoOccidentalPage } from './pago-occidental.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';
import { OtpOccidentalComponent } from 'src/app/shared/components/otp-occidental/otp-occidental.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoOccidentalPageRoutingModule,
    ReactiveFormsModule,
    DefaultSharedModule
  ],
  declarations: [PagoOccidentalPage,OtpOccidentalComponent]
})
export class PagoOccidentalPageModule {}
