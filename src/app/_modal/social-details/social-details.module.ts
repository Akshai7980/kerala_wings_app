import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SocialDetailsPageRoutingModule } from './social-details-routing.module';

import { SocialDetailsPage } from './social-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SocialDetailsPageRoutingModule
  ],
  declarations: [SocialDetailsPage]
})
export class SocialDetailsPageModule {}
