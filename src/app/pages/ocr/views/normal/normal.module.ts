import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NormalPageRoutingModule } from './normal-routing.module';

import { NormalPage } from './normal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NormalPageRoutingModule
  ],
  declarations: [NormalPage]
})
export class NormalPageModule {}
