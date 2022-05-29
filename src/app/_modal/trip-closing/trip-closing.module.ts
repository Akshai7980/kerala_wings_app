import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripClosingPageRoutingModule } from './trip-closing-routing.module';

import { TripClosingPage } from './trip-closing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripClosingPageRoutingModule
  ],
  declarations: [TripClosingPage]
})
export class TripClosingPageModule {}
