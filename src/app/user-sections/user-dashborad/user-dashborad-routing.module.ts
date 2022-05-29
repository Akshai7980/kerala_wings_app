import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDashboradPage } from './user-dashborad.page';

const routes: Routes = [
  {
    path: '',
    component: UserDashboradPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDashboradPageRoutingModule {}
