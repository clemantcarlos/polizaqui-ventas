import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsOccidentalPage } from './products-occidental.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsOccidentalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsOccidentalPageRoutingModule {}
