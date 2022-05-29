import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTermsAndConditionPageRoutingModule } from './user-terms-and-condition-routing.module';

import { UserTermsAndConditionPage } from './user-terms-and-condition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTermsAndConditionPageRoutingModule
  ],
  declarations: [UserTermsAndConditionPage]
})
export class UserTermsAndConditionPageModule {}
