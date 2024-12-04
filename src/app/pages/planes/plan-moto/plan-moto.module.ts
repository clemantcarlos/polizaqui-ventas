import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanMotoPageRoutingModule } from './plan-moto-routing.module';

import { PlanMotoPage } from './plan-moto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanMotoPageRoutingModule
  ],
  declarations: [PlanMotoPage]
})
export class PlanMotoPageModule {}
