import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NavigationExtras } from "@angular/router";
import { ApiService } from "src/app/_service/api.service";
import { CommonService } from "src/app/_service/common.service";
import { StorageService } from "src/app/_service/storage.service";
import { UserRegistrationPage } from "../user-registration/user-registration.page";

@Component({
  selector: "app-user-login",
  templateUrl: "./user-login.page.html",
  styleUrls: ["./user-login.page.scss"],
})
export class UserLoginPage implements OnInit {
  loginForm: FormGroup;
  otpForm: FormGroup;
  showLoader: boolean;
  isChecked: boolean;
  showPassword: boolean;
  userDetails: any = [];
  otpNumber: number;
  showOtpFields: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public common: CommonService,
    private storage: StorageService,
    private api: ApiService
  ) {
    this.otpForm = this.formBuilder.group({
      otp: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.min(6),
          Validators.pattern("^[0-9]+$"),
        ])
      ),
    });
  }

  ngOnInit() {
    this.loginFormValidator();
  }

  loginFormValidator() {
    this.loginForm = this.formBuilder.group({
      mobile: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.min(10),
          Validators.pattern("^[0-9]+$"),
        ])
      ),
      role: new FormControl("user"),
      token: new FormControl(""),
    });
  }

  loginSubmit() {
    if (this.loginForm.valid) {
      console.log("loginForm:", this.loginForm.value);
      this.showLoader = true;
      this.api.post("driver_send_otp_login_new", this.loginForm.value).then(
        (res: any) => {
          this.showLoader = false;
          const responseData = JSON.parse(res.data);
          console.log("responseData:", responseData);
          if (responseData.status === true) {
            this.storage.setStorage("ROLE", responseData.role);
            console.log("OTP:", responseData.otp);
            if (responseData.userdetails.customer_name === null) {
              this.showLoader = false;
              this.presentRegisterModal(responseData.userdetails.id);
              // const alertHead = "Failed!";
              // const alertMsg =
              //   "Your details are not registered with Kerala Wings, Please Login with a registered mobile number.";
              // this.common.presentAlert(alertHead, alertMsg);
              // this.loginForm.reset();
            } else {
              this.showLoader = false;
              this.userDetails = responseData.userdetails;
              this.otpNumber = responseData.otp;
              this.showOtpFields = true;
              const element = document.querySelector("#sendOtpForm");
              element.classList.add("animate__animated", "animate__zoomOut");
            }
          } else {
            console.log("failed");
            this.showLoader = false;
            const toastMsg = "Something went wrong, Please try again later";
            const toastTime = 3000;
            this.common.presentToast(toastMsg, toastTime);
          }
        },
        (err) => {
          this.showLoader = false;
          console.log("Error:", err);
          const toastMsg = "Server error, Please try again later";
          const toastTime = 3000;
          this.common.presentToast(toastMsg, toastTime);
        }
      );
    } else {
      const alertHead = "Failed!";
      const alertMessage =
        "Please enter valid details and <strong>password must contain 6 digits.</strong>";
      this.common.presentAlert(alertHead, alertMessage);
      console.log("not valid");
    }
  }

  otpSubmit() {
    console.log("otp");
    console.log("otpNumber:", this.otpNumber);
    console.log("otpForm:", this.otpForm.value.otp);
    if (this.otpForm.valid) {
      if (this.otpNumber === this.otpForm.value.otp) {
        const loadingMsg =
          "Hai " +
          this.userDetails.customer_name +
          " you had successfully logged in to your profile.";
        const loadingTime = 3000;
        this.common.presentLoading(loadingMsg, loadingTime);
        console.log("login successful");
        this.storage.setStorage("USER_DETAILS", this.userDetails);
        console.log("userdetails:", this.userDetails);
        const navigationExtras: NavigationExtras = {
          state: {
            userInfo: this.userDetails,
          },
        };
        this.common.navCtrl.navigateRoot("/user-dashborad", navigationExtras);
      } else {
        console.log("otp not correct");
        const alertHead = "Failed!";
        const alertMsg = "You entered a wrong OTP.";
        this.common.presentAlert(alertHead, alertMsg);
      }
    } else {
      console.log("form not valid");
      const alertHead = "Failed!";
      const alertMsg = "OTP form is not valid.";
      this.common.presentAlert(alertHead, alertMsg);
    }
  }

  async presentRegisterModal(userId: number) {
    const modal = await this.common.modalCtrl.create({
      component: UserRegistrationPage,
      cssClass: 'register-modal',
      componentProps: {
        phone: this.loginForm.value.mobile,
        userId: userId,
      },
    });
    return await modal.present();
  }
}
