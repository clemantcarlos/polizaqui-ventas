import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanOccidentalRcvPage } from './plan-occidental-rcv.page';

const routes: Routes = [
  {
    path: '',
    component: PlanOccidentalRcvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanOccidentalRcvPageRoutingModule {}
