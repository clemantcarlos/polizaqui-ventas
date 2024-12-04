import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoMundialPage } from './pago-mundial.page';

const routes: Routes = [
  {
    path: '',
    component: PagoMundialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagoMundialPageRoutingModule {}
