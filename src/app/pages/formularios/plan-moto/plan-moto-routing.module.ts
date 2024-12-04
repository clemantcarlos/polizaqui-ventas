import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanMotoPage } from './plan-moto.page';

const routes: Routes = [
  {
    path: '',
    component: PlanMotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanMotoPageRoutingModule {}
