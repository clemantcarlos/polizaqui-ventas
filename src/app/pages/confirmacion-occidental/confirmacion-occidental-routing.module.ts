import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmacionOccidentalPage } from './confirmacion-occidental.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmacionOccidentalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmacionOccidentalPageRoutingModule {}
