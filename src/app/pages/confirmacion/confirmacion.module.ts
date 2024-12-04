import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmacionPageRoutingModule } from './confirmacion-routing.module';

import { ConfirmacionPage } from './confirmacion.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';
import { ConfirmationService } from 'src/app/services/confirmation.service';
import { FinalCompartirComponent } from 'src/app/shared/components/final-compartir/final-compartir.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmacionPageRoutingModule,
    DefaultSharedModule
  ],
  providers:[ConfirmationService],
  declarations: [ConfirmacionPage,FinalCompartirComponent]
})
export class ConfirmacionPageModule {}
