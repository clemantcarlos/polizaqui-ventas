import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RcvPage } from './rcv.page';

const routes: Routes = [
  {
    path: '',
    component: RcvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RcvPageRoutingModule {}
