/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/_service/api.service';
import { CommonService } from 'src/app/_service/common.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userDetails: any = [];

  userProfileForm = new FormGroup({
    name: new FormControl(undefined),
    location: new FormControl(undefined),
    phone: new FormControl(undefined),
    email: new FormControl(undefined),
    landnumber: new FormControl(undefined),
    vehicleName: new FormControl(undefined),
    vehicleType: new FormControl(undefined),
    vehicleNumber: new FormControl(undefined),
    address: new FormControl(undefined),
    // vehicletransmission: new FormControl(undefined),
    gender: new FormControl(undefined),
  });

  constructor(public common: CommonService, private api: ApiService) {}

  ngOnInit() {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        console.log('userDetails:', this.userDetails);
      }
    });
    this.userProfileForm.controls['name'].setValue(
      this.userDetails.customer_name
    );
    if (this.userDetails.landnumber) {
      this.userProfileForm.controls['landnumber'].setValue(
        this.userDetails.landnumber
      );
    }
    if (this.userDetails.customer_number) {
      this.userProfileForm.controls['phone'].setValue(
        this.userDetails.customer_number
      );
    }
    if (this.userDetails.address) {
      this.userProfileForm.controls['address'].setValue(
        this.userDetails.address
      );
    }
    if (this.userDetails.location) {
      this.userProfileForm.controls['location'].setValue(
        this.userDetails.location
      );
    }
    if (this.userDetails.vehicle_name) {
      this.userProfileForm.controls['vehicleName'].setValue(
        this.userDetails.vehicle_name
      );
    }
    if (this.userDetails.vehicle_number) {
      this.userProfileForm.controls['vehicleNumber'].setValue(
        this.userDetails.vehicle_number
      );
    }
  }

  submitProfile() {
    console.log('userProfileForm:', this.userProfileForm.value);
    if (this.userProfileForm.valid) {
      this.common.simpleLoader('');
      const params = {
        user_id: this.userDetails.id,
        name: this.userDetails.customer_name,
        email: this.userProfileForm.value.email,
        location: this.userProfileForm.value.location,
        phone: this.userProfileForm.value.phone,
        landnumber: this.userProfileForm.value.landnumber,
        vehicleName: this.userProfileForm.value.vehicleName,
        vehicleType: this.userProfileForm.value.vehicleType,
        vehicleNumber: this.userProfileForm.value.vehicleNumber,
        address: this.userProfileForm.value.address,
        vehicletransmission: this.userProfileForm.value.vehicletransmission,
        gender: this.userProfileForm.value.gender,
        cabType: this.userProfileForm.value.cabType,
      };
      console.log('params:', params);
      this.api.post('profile_update_driver', params).then(
        (res: any) => {
          const responseData = JSON.parse(res.data);
          console.log('responseData:', responseData);
          if (responseData.status === true) {
            const toastMsg = 'Your profile details successfully updated.';
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
            this.common.router.navigate(['/user-dashborad']);
            this.common.dismissLoader();
          }
        },
        (err) => {
          console.log('err:', err);
          const toastMsg = 'Something went wrong, please try again later !';
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
          this.common.dismissLoader();
        }
      );
    } else {
      const alertHead = 'Failed!';
      const alertMsg = 'Please enter valid details and then update.';
      this.common.presentAlert(alertHead, alertMsg);
      this.common.dismissLoader();
    }
  }
}
