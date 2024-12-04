import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanSaludPageRoutingModule } from './plan-salud-routing.module';

import { PlanSaludPage } from './plan-salud.page';
import { PolizaService } from 'src/app/services/poliza.service';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanSaludPageRoutingModule,
    ReactiveFormsModule,
    DefaultSharedModule
  ],
  providers:[PolizaService],
  declarations: [PlanSaludPage]
})
export class PlanSaludPageModule {}
