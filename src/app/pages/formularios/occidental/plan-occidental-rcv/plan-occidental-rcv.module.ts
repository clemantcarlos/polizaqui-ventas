import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanOccidentalRcvPageRoutingModule } from './plan-occidental-rcv-routing.module';

import { PlanOccidentalRcvPage } from './plan-occidental-rcv.page';
import { DefaultSharedModule } from 'src/app/shared/module/default-shared.module';
import { OccidentalService } from 'src/app/services/occidental.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanOccidentalRcvPageRoutingModule,
    ReactiveFormsModule,
    DefaultSharedModule
  ],
  providers: [OccidentalService],
  declarations: [PlanOccidentalRcvPage]
})
export class PlanOccidentalRcvPageModule {}
