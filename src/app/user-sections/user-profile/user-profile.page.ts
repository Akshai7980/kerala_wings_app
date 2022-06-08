/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/_service/api.service";
import { CommonService } from "src/app/_service/common.service";
import { StorageService } from "src/app/_service/storage.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.page.html",
  styleUrls: ["./user-profile.page.scss"],
})
export class UserProfilePage implements OnInit {
  userDetails: any = [];

  userProfileForm = new FormGroup({
    customer_name: new FormControl(undefined),
    location: new FormControl(undefined),
    customer_number: new FormControl(undefined),
    landnumber: new FormControl(undefined),
    // vehicleName: new FormControl(undefined),
    // vehicle_type: new FormControl(undefined),
    // vehicle_number: new FormControl(undefined),
    address: new FormControl(undefined),
  });

  constructor(
    public common: CommonService,
    private api: ApiService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        console.log("userDetails:", this.userDetails);
      }
    });
    this.userProfileForm.controls["customer_name"].setValue(
      this.userDetails.customer_name
    );
    if (this.userDetails.landnumber) {
      this.userProfileForm.controls["landnumber"].setValue(
        this.userDetails.landnumber
      );
    }
    if (this.userDetails.customer_number) {
      this.userProfileForm.controls["customer_number"].setValue(
        this.userDetails.customer_number
      );
    }
    if (this.userDetails.address) {
      this.userProfileForm.controls["address"].setValue(
        this.userDetails.address
      );
    }
    if (this.userDetails.location) {
      this.userProfileForm.controls["location"].setValue(
        this.userDetails.location
      );
    }
    // if (
    //   this.userDetails.vehicle_name &&
    //   this.userDetails.vehicle_name !== "null"
    // ) {
    //   this.userProfileForm.controls["vehicleName"].setValue(
    //     this.userDetails.vehicle_name
    //   );
    // }
    // if (this.userDetails.vehicle && this.userDetails.vehicle !== "null") {
    //   this.userProfileForm.controls["vehicle_type"].setValue(
    //     this.userDetails.vehicle
    //   );
    // }
    // if (
    //   this.userDetails.vehicle_number &&
    //   this.userDetails.vehicle_number !== "null"
    // ) {
    //   this.userProfileForm.controls["vehicle_number"].setValue(
    //     this.userDetails.vehicle_number
    //   );
    // }
  }

  submitProfile() {
    console.log("userProfileForm:", this.userProfileForm.value);
    if (this.userProfileForm.valid) {
      this.common.simpleLoader("");
      const params = {
        user_id: this.userDetails.id,
        customer_name: this.userDetails.customer_name,
        location: this.userProfileForm.value.location,
        customer_number: this.userProfileForm.value.customer_number,
        landnumber: this.userProfileForm.value.landnumber,
        // vehicleName: this.userProfileForm.value.vehicleName,
        // vehicle_number: this.userProfileForm.value.vehicle_number,
        // vehicle_type: this.userProfileForm.value.vehicle_type,
        address: this.userProfileForm.value.address,
      };
      console.log("params:", params);
      this.api.post("user_profile_update", params).then(
        (res: any) => {
          const responseData = JSON.parse(res.data);
          console.log("responseData:", responseData);
          if (responseData.status === true) {
            this.storage.setStorage("USER_DETAILS", responseData.userdetails);
            const toastMsg = "Your profile details successfully updated.";
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
            this.common.router.navigate(["/user-dashborad"]);
            this.common.dismissLoader();
          }
        },
        (err) => {
          console.log("err:", err);
          const toastMsg = "Something went wrong, please try again later !";
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
          this.common.dismissLoader();
        }
      );
    } else {
      const alertHead = "Failed!";
      const alertMsg = "Please enter valid details and then update.";
      this.common.presentAlert(alertHead, alertMsg);
      this.common.dismissLoader();
    }
  }
}
