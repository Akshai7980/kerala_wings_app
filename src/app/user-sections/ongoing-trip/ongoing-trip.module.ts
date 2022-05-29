import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OngoingTripPageRoutingModule } from './ongoing-trip-routing.module';

import { OngoingTripPage } from './ongoing-trip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OngoingTripPageRoutingModule
  ],
  declarations: [OngoingTripPage]
})
export class OngoingTripPageModule {}
