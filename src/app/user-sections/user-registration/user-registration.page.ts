import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_service/api.service';
import { CommonService } from 'src/app/_service/common.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.page.html',
  styleUrls: ['./user-registration.page.scss'],
})
export class UserRegistrationPage implements OnInit {
  registerForm: FormGroup;
  showLoader: boolean;
  isChecked: boolean;
  showPassword: boolean;
  constructor(
    private formBuilder: FormBuilder,
    public common: CommonService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.registerFormValidator();
  }

  registerFormValidator() {
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      userName: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      phone: [null, [Validators.required, Validators.minLength(5)]],
    });
  }

  registerSubmit() {
    if (this.registerForm.valid) {
      console.log('registerForm:', this.registerForm.value);
      this.showLoader = true;
      this.api.post('Auth/authenticatedriver', this.registerForm.value).then(
        (res: any) => {
          console.log('res:', res);
          if (res?.success === true) {
            if (res?.message === 'Wrong UserName/Password') {
              this.showLoader = false;
              const alertHead = 'Failed!';
              const alertMessage =
                'Invalid login credentials, Wrong UserName/Password';
              this.common.presentAlert(alertHead, alertMessage);
            } else {
              this.showLoader = false;
              this.common.navCtrl.navigateRoot('/tabs/tab3');
              // const loadMessage =
              //   "<strong>" +
              //   this.loginForm.value.userName +
              //   "</strong> successfully logged in.";
              // const loadTime = 1000;
              // this.common.presentLoading(loadMessage, loadTime);
              console.log('token:', res?.model?.token);
            }
          } else {
            console.log('failed');
            const toastMsg = 'Something went wrong, Please try again later';
            const toastTime = 3000;
            this.common.presentToast(toastMsg, toastTime);
          }
        },
        (err) => {
          this.showLoader = false;
          console.log('Error:', err);
          const toastMsg = 'Something went wrong, Please try again later';
          const toastTime = 3000;
          this.common.presentToast(toastMsg, toastTime);
        }
      );
    } else {
      const alertHead = 'Failed!';
      const alertMessage =
        'Please enter valid details and <strong>password must contain 6 digits.</strong>';
      this.common.presentAlert(alertHead, alertMessage);
      console.log('not valid');
    }
  }
}
