import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanSaludPage } from './plan-salud.page';

const routes: Routes = [
  {
    path: '',
    component: PlanSaludPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanSaludPageRoutingModule {}
