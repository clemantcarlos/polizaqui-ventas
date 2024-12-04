import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsOccidentalPageRoutingModule } from './products-occidental-routing.module';

import { ProductsOccidentalPage } from './products-occidental.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsOccidentalPageRoutingModule
  ],
  declarations: [ProductsOccidentalPage]
})
export class ProductsOccidentalPageModule {}
