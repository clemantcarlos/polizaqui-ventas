import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FunerarioMundialPage } from './funerario-mundial.page';

const routes: Routes = [
  {
    path: '',
    component: FunerarioMundialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FunerarioMundialPageRoutingModule {}
