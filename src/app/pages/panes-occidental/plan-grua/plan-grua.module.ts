import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanGruaPageRoutingModule } from './plan-grua-routing.module';

import { PlanGruaPage } from './plan-grua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanGruaPageRoutingModule
  ],
  declarations: [PlanGruaPage]
})
export class PlanGruaPageModule {}
