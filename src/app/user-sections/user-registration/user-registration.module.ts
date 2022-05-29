import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserRegistrationPageRoutingModule } from './user-registration-routing.module';

import { UserRegistrationPage } from './user-registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UserRegistrationPageRoutingModule
  ],
  declarations: [UserRegistrationPage]
})
export class UserRegistrationPageModule {}
