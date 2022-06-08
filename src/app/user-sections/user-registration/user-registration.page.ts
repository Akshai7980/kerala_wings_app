import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "src/app/_service/api.service";
import { CommonService } from "src/app/_service/common.service";

@Component({
  selector: "app-user-registration",
  templateUrl: "./user-registration.page.html",
  styleUrls: ["./user-registration.page.scss"],
})
export class UserRegistrationPage implements OnInit {
  @Input() phone: number;
  showLoader: boolean;
  @Input() userId: number;

  registerForm = new FormGroup({
    customer_name: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(3),
    ]),
    address: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(5),
    ]),
    location: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(2),
    ]),
    customer_number: new FormControl(undefined, [
      Validators.required,
      Validators.min(10),
    ]),
    landnumber: new FormControl(undefined),
    vehicleName: new FormControl(undefined),
    vehicle_type: new FormControl(undefined),
    vehicle_number: new FormControl(undefined),
  });
  constructor(public common: CommonService, private api: ApiService) {}

  ngOnInit() {
    console.log("phone:",this.phone);
    console.log("userId:",this.userId);
    this.registerForm.controls["customer_number"].setValue(this.phone);
  }

  registerSubmit() {
    console.log("registerForm:", this.registerForm.value);
    if (this.registerForm.valid) {
      const params = {
        user_id: this.userId,
        customer_name: this.registerForm.value.customer_name,
        location: this.registerForm.value.location,
        customer_number: this.registerForm.value.customer_number,
        landnumber: this.registerForm.value.landnumber,
        vehicleName: this.registerForm.value.vehicleName,
        vehicle_number: this.registerForm.value.vehicle_number,
        vehicle_type: this.registerForm.value.vehicle_type,
        address: this.registerForm.value.address,
      };
      console.log("params:", params);
      this.showLoader = true;
      this.api.post("user_profile_update", params).then(
        (res: any) => {
          const responseData = JSON.parse(res.data);
          console.log("responseData:", responseData);
          if (responseData.status === true) {
            const toastMsg =
              "Your details with kerala wings have successfully registered, please login to continue with us.";
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
            this.common.modalCtrl.dismiss();
            // this.common.router.navigate(["/user-login"]);
            this.showLoader = false;
          } else {
            console.log("failed");
            const toastMsg =
              "User registration failed, Please try again later.";
            const toastTime = 3000;
            this.common.presentToast(toastMsg, toastTime);
            this.showLoader = false;
          }
        },
        (err) => {
          this.showLoader = false;
          console.log("Error:", err);
          const toastMsg = "Something went wrong, Please try again later.";
          const toastTime = 3000;
          this.common.presentToast(toastMsg, toastTime);
          this.showLoader = false;
        }
      );
    } else {
      const alertHead = "Failed!";
      const alertMessage =
        "Please enter valid details and <strong>password must contain 6 digits.</strong>";
      this.common.presentAlert(alertHead, alertMessage);
      console.log("not valid");
      this.showLoader = false;
    }
  }
}
