import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanGruaPage } from './plan-grua.page';

const routes: Routes = [
  {
    path: '',
    component: PlanGruaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanGruaPageRoutingModule {}
