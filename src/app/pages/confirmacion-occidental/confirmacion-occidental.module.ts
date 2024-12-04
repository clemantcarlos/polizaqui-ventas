import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmacionOccidentalPageRoutingModule } from './confirmacion-occidental-routing.module';

import { ConfirmacionOccidentalPage } from './confirmacion-occidental.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';
import { ConfirmationService } from 'src/app/services/confirmation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmacionOccidentalPageRoutingModule,
    DefaultSharedModule
  ],
  providers:[ConfirmationService],
  declarations: [ConfirmacionOccidentalPage]
})
export class ConfirmacionOccidentalPageModule {}
