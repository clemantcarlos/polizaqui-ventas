import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcvPageRoutingModule } from './rcv-routing.module';

import { RcvPage } from './rcv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RcvPageRoutingModule
  ],
  declarations: [RcvPage]
})
export class RcvPageModule {}
