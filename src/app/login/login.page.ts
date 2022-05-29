/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/semi */
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ApiService } from '../_service/api.service';
import { CommonService } from '../_service/common.service';
import { StorageService } from '../_service/storage.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  otpForm: FormGroup;
  showOtpFields: boolean;
  userDetails: any;
  showLoader: boolean;
  otpNumber: number;

  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    private storage: StorageService,
    private api: ApiService,
    private fcm: FCM
  ) {
    this.loginForm = this.formBuilder.group({
      mobile: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.min(10),
          Validators.pattern('^[0-9]+$'),
        ])
      ),
      role: new FormControl(
        'driver',
      ),
      token: new FormControl(''),
    });

    this.otpForm = this.formBuilder.group({
      otp: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.min(6),
          Validators.pattern('^[0-9]+$'),
        ])
      ),
    });
  }

  ngOnInit() {
    this.showOtpFields = false;
    this.showLoader = false;
    this.userDetails = [];
    this.common.menu.swipeGesture(false);

    if (this.common.platform.is('cordova')) {
      this.getToken();
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
          console.log('Notification Received in background');
        } else {
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

  getToken() {
    this.fcm
      .getToken()
      .then((token) => {
        console.log('token:', token);
        this.loginForm.get('token').setValue(token);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }

  sendOtp() {
    if (this.loginForm.valid) {
      if (this.common.platform.is('cordova')) {
        this.showLoader = true;
        this.api.post('driver_send_otp_login_new', this.loginForm.value).then(
          (res: any) => {
            const responseData = JSON.parse(res.data);
            console.log('responseData:',responseData);
            if (responseData.status === true) {
              this.storage.setStorage('ROLE', responseData.role);
              if (responseData.userdetails.first_name === null) {
                this.showLoader = false;
                const alertHead = 'Failed!';
                const alertMsg =
                  'Your details are not registered with Kerala Wings, Please Login with a registered mobile number.';
                this.common.presentAlert(alertHead, alertMsg);
                this.loginForm.reset();
              } else {
                this.showLoader = false;
                this.userDetails = responseData.userdetails;
                this.otpNumber = responseData.otp;
                this.showOtpFields = true;
                const element = document.querySelector('#sendOtpForm');
                element.classList.add('animate__animated', 'animate__zoomOut');
              }
            } else {
              this.showLoader = false;
            }
          },
          (err) => {
            console.log('err:', err);
            this.showLoader = false;
            const toastMsg = 'Something went wrong, please try again later !';
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
          }
        );
      } else {
        this.showLoader = false;
        console.log('web');
        this.common.navCtrl.navigateRoot('/tabs/tab2');
      }
    } else {
      this.showLoader = false;
      const alertHead = 'Failed!';
      const alertMsg =
        'Please enter valid mobile number and then press send otp';
      this.common.presentAlert(alertHead, alertMsg);
    }
  }

  otpSubmit() {
    console.log('otp');
    console.log('otpNumber:', this.otpNumber);
    console.log('otpForm:', this.otpForm.value.otp);
    if (this.otpForm.valid) {
      if (this.otpNumber === this.otpForm.value.otp) {
        const loadingMsg =
          'Hai ' +
          this.userDetails.first_name +
          ' you had successfully logged in to your profile.';
        const loadingTime = 3000;
        this.common.presentLoading(loadingMsg, loadingTime);
        console.log('login successful');
        this.storage.setStorage('USER_DETAILS', this.userDetails);
        console.log('userdetails:', this.userDetails);
        this.common.navCtrl.navigateRoot('/tabs/tab2');
      } else {
        console.log('otp not correct');
        const alertHead = 'Failed!';
        const alertMsg = 'You entered a wrong OTP.';
        this.common.presentAlert(alertHead, alertMsg);
      }
    } else {
      console.log('form not valid');
      const alertHead = 'Failed!';
      const alertMsg = 'OTP form is not valid.';
      this.common.presentAlert(alertHead, alertMsg);
    }
  }
}
