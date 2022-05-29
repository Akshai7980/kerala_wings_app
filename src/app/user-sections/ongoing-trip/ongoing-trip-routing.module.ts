import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OngoingTripPage } from './ongoing-trip.page';

const routes: Routes = [
  {
    path: '',
    component: OngoingTripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OngoingTripPageRoutingModule {}
