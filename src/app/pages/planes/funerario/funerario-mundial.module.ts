import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FunerarioMundialPageRoutingModule } from './funerario-mundial-routing.module';

import { FunerarioMundialPage } from './funerario-mundial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FunerarioMundialPageRoutingModule
  ],
  declarations: [FunerarioMundialPage]
})
export class FunerarioMundialPageModule {}
