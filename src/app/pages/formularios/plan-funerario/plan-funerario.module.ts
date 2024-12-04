import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanFunerarioPageRoutingModule } from './plan-funerario-routing.module';

import { PlanFunerarioPage } from './plan-funerario.page';
import { PolizaService } from 'src/app/services/poliza.service';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanFunerarioPageRoutingModule,
    ReactiveFormsModule,
    DefaultSharedModule
  ],
  providers:[PolizaService],
  declarations: [PlanFunerarioPage]
})
export class PlanFunerarioPageModule {}
