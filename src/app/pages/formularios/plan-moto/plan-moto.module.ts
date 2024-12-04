import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanMotoPageRoutingModule } from './plan-moto-routing.module';

import { PlanMotoPage } from './plan-moto.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanMotoPageRoutingModule,
    ReactiveFormsModule,
    DefaultSharedModule
  ],
  declarations: [PlanMotoPage]
})
export class PlanMotoPageModule {}
