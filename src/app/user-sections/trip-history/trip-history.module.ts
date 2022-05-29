import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripHistoryPageRoutingModule } from './trip-history-routing.module';

import { TripHistoryPage } from './trip-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripHistoryPageRoutingModule
  ],
  declarations: [TripHistoryPage]
})
export class TripHistoryPageModule {}
