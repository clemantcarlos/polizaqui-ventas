import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoOccidentalPage } from './pago-occidental.page';

const routes: Routes = [
  {
    path: '',
    component: PagoOccidentalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagoOccidentalPageRoutingModule {}
