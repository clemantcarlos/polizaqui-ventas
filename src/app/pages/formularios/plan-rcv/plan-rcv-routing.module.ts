import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanRcvPage } from './plan-rcv.page';

const routes: Routes = [
  {
    path: '',
    component: PlanRcvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanRcvPageRoutingModule {}
