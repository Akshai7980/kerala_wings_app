/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild } from '@angular/core';
import { EditProfilePage } from '../_modal/edit-profile/edit-profile.page';
import { CommonService } from '../_service/common.service';
import { StorageService } from '../_service/storage.service';
import { IonSlides } from '@ionic/angular';
import Swiper, { Navigation, Pagination } from 'swiper';
import { NavigationExtras } from '@angular/router';
// import 'swiper/css';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../_service/api.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;

  userDetails: any = [];
  sliderImages: any = [];
  slideView: any;
  alertMode: string;
  loopMode: string;
  tripDetails: any = [];

  constructor(
    private common: CommonService,
    private storage: StorageService,
    private nativeAudio: NativeAudio,
    private audio: AudioManagement,
    private vibration: Vibration,
    private alert: AlertController,
    private api: ApiService,
    private fcm: FCM
  ) {}

  ngOnInit(): void {
    this.setRingtone();
    this.sliderImages = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          Image: '../../assets/images/trip1.jpeg',
        },
        {
          Image: '../../assets/images/trip2.jpeg',
        },
        {
          Image: '../../assets/images/trip3.jpeg',
        },
        {
          Image: '../../assets/images/trip4.jpeg',
        },
        {
          Image: '../../assets/images/trip5.jpeg',
        },
        {
          Image: '../../assets/images/trip6.webp',
        },
      ],
    };
    if (this.common.platform.is('cordova')) {
      this.subscribePushNotification();
    } else {
      console.log('web');
    }
  }

  subscribePushNotification() {
    this.fcm.onNotification().subscribe(
      (data) => {
        console.log('data:',data);
        if (data.wasTapped) {
          this.loopMode = 'loop';
          this.createAlert();
          console.log('Notification Received in background');
        } else {
          this.loopMode = 'once';
          this.createAlert();
          console.log('Notification Received in foreground');
        }
      },
      (err) => {
        console.log('Error:', err);
      }
    );

    this.fcm.onTokenRefresh().subscribe(
      (token) => {
        console.log('token:', token);
      },
      (err) => {
        console.log('Error:', err);
      }
    );
  }

  setRingtone() {
    // Preload the audio track
    this.nativeAudio.preloadSimple(
      'uniqueId1',
      'assets/tune-android/Antique-Phone.mp3'
    );
  }

  ionViewWillEnter() {
    this.getUserDetails();
    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      allowSlideNext: true,
      loop: true,
      init: true,
      speed: 100,
      autoplay: {
        delay: 300,
        disableOnInteraction: false,
      },
      modules: [Navigation, Pagination],
    });
    if (this.slideView.allowSlideNext === true) {
      setInterval(() => {
        this.slideView.swiperRef.slideNext(3000);
      }, 5000);
    }
  }

  getUserDetails() {
    this.storage.storage.get('USER_DETAILS').then((val) => {
      if (val) {
        this.userDetails = val;
        this.getDriverTrip(this.userDetails);
        console.log('userdetails:', this.userDetails);
        if (this.userDetails.code === null) {
          this.getIsUserModalClosed();
        }
      }
    });
  }

  getDriverTrip(details: any) {
    const params = {
      driver_id: details.id,
    };
    this.api.post('active_trip', params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        if (responseData.status === true) {
          this.tripDetails = responseData.active_trip;
          console.log('tripDetails:', this.tripDetails);
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  getIsUserModalClosed() {
    this.storage.storage.get('USER_DETAILS_MODAL').then((val) => {
      if (val) {
        console.log('isOnceClosed:', val);
      } else {
        this.presentApproveModal();
      }
    });
  }

  async presentApproveModal() {
    const modal = await this.common.modalCtrl.create({
      component: EditProfilePage,
      cssClass: 'approve-modal',
      backdropDismiss: false,
      componentProps: {
        first_name: this.userDetails.first_name,
        last_name: this.userDetails.last_name,
        phone_no: this.userDetails.phone_no,
        address: this.userDetails.address,
        licence_no: this.userDetails.licence_no,
        adhar: this.userDetails.adhar,
        dob: this.userDetails.dob,
        home_mobile: this.userDetails.home_mobile,
        driver_id: this.userDetails.driver_id,
      },
    });
    return await modal.present();
  }

  onSwiper(event) {
    console.log('event', event);
  }

  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    object.isBeginningSlide = slideView?.swiperRef?.isBeginning;
    console.log('object.isBeginningSlide', object);
  }
  checkisEnd(object, slideView) {
    object.isEndSlide = slideView?.swiperRef?.isEnd;
    console.log('object.isEndSlide', object);
  }

  onSlideChange(object, slideView) {
    this.slideView = slideView;
    if (object?.slidesItems.length !== 0) {
    }
  }

  gotoPage(page: any) {
    const p = page;
    const navigationExtras: NavigationExtras = {
      state: {
        userInfo: this.userDetails,
        trip: this.tripDetails
      },
    };
    this.common.router.navigate([p], navigationExtras);
  }

  ionViewWillLeave() {
    // this.swiper.destroy();
  }

  getAudioMode() {
    return new Promise(async (resolve, reject) => {
      this.audio
        .getAudioMode()
        .then((value) => {
          if (value.audioMode === 0 || value.audioMode === 1) {
            // this will cause vibration in silent mode as well
            this.alertMode = 'Vibrate';
            resolve(false);
          } else {
            this.alertMode = 'Ring';
            resolve(true);
          }
        })
        .catch((error) => {
          resolve(false);
        });
    });
  }

  async createAlert() {
    const audioMode = await this.getAudioMode();
    if (audioMode) {
      // ring mode
      this.loopMode === 'once' ? this.playSingle() : this.playLoop();
    } else {
      this.loopMode === 'once'
        ? this.vibration.vibrate(1000)
        : this.vibration.vibrate([
            1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000,
          ]);
      this.showAlert();
    }
  }

  playSingle() {
    this.nativeAudio
      .play('uniqueId1')
      .then(() => {
        console.log('Successfully played');
        this.showAlert();
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  playLoop() {
    this.nativeAudio
      .loop('uniqueId1')
      .then(() => {
        console.log('Successfully played');
        this.showAlert();
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  async showAlert() {
    const cancelAlert = await this.alert.create({
      header: 'Trip Alert',
      message:
        'You just played alert with ' +
        this.alertMode +
        ' , and played it ' +
        `${this.loopMode === 'once' ? 'just once' : 'on loop'}`,
      buttons: [
        {
          text: 'Ok, great!',
          handler: async () => {
            const audioMode = await this.getAudioMode();
            if (audioMode) {
              this.nativeAudio.stop('uniqueId1');
            } else {
              this.vibration.vibrate(0);
            }
            cancelAlert.dismiss();
          },
        },
      ],
    });
    cancelAlert.present();
  }
}
