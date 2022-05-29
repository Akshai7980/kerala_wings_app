import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IonicStorageModule } from '@ionic/storage'; // For Importing Ionic local storage module
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { FormBuilder  } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'KeralaWings',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    }),
    SwiperModule,
  ],
  providers: [
    HTTP,
    SplashScreen,
    CallNumber,
    FormBuilder,
    Vibration,
    AudioManagement,
    NativeAudio,
    BackgroundMode,
    FCM,
    { provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
