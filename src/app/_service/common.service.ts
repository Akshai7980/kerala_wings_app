/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable } from '@angular/core';
import {
  ModalController,
  ToastController,
  Platform,
  NavController,
  AlertController,
  ActionSheetController,
  LoadingController,
  PopoverController,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public menu: MenuController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public platform: Platform,
    public router: Router,
    public popOver: PopoverController
  ) {}

  // ----- App's Alert Controller -----
  async presentAlert(head, msg) {
    const alert = await this.alertCtrl.create({
      header: head,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  // ----- App's Alert Controller -----

  // ----- App's Toast Controller -----
  async presentToast(msg, time) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: time,
    });
    toast.present();
  }

  // ----- App's Toast Controller -----

  // ----- App's Loader Controller -----
  async presentLoading(msg, time) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: msg,
      duration: time,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');

    await loading.addEventListener('ionLoadingWillPresent', (event: any) => {
      console.log('event:', event);
    });
  }

  simpleLoader(msg) {
    this.loadingCtrl
      .create({
        spinner: 'crescent',
        message: msg,
        cssClass: 'custom-loading'
      })
      .then((response) => {
        response.present();
      });
  }

  // Dismiss loader
  dismissLoader() {
    this.loadingCtrl
      .dismiss()
      .then((response) => {
        console.log('Loader closed!', response);
      })
      .catch((err) => {
        console.log('Error occured : ', err);
      });
  }
  // ----- App's Loader Controller -----
}
