import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripClosingPage } from './trip-closing.page';

const routes: Routes = [
  {
    path: '',
    component: TripClosingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripClosingPageRoutingModule {}
