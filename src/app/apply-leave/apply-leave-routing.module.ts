import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyLeavePage } from './apply-leave.page';

const routes: Routes = [
  {
    path: '',
    component: ApplyLeavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplyLeavePageRoutingModule {}
