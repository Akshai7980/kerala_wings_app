import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDashboradPageRoutingModule } from './user-dashborad-routing.module';

import { UserDashboradPage } from './user-dashborad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserDashboradPageRoutingModule
  ],
  declarations: [UserDashboradPage]
})
export class UserDashboradPageModule {}
