import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OccidentalPageRoutingModule } from './occidental-routing.module';

import { OccidentalPage } from './occidental.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OccidentalPageRoutingModule
  ],
  declarations: [OccidentalPage]
})
export class OccidentalPageModule {}
