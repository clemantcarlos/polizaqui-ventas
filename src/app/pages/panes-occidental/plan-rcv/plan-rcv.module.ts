import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanRcvPageRoutingModule } from './plan-rcv-routing.module';

import { PlanRcvPage } from './plan-rcv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanRcvPageRoutingModule
  ],
  declarations: [PlanRcvPage]
})
export class PlanRcvPageModule {}
