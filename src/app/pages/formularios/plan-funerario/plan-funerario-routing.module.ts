import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanFunerarioPage } from './plan-funerario.page';

const routes: Routes = [
  {
    path: '',
    component: PlanFunerarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanFunerarioPageRoutingModule {}
