import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanRcvPageRoutingModule } from './plan-rcv-routing.module';

import { PlanRcvPage } from './plan-rcv.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanRcvPageRoutingModule,
    ReactiveFormsModule,
    DefaultSharedModule
  ],
  declarations: [PlanRcvPage]
})
export class PlanRcvPageModule {}
