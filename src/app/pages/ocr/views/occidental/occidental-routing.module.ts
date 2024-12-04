import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OccidentalPage } from './occidental.page';

const routes: Routes = [
  {
    path: '',
    component: OccidentalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OccidentalPageRoutingModule {}
