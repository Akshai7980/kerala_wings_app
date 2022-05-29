/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/_service/api.service';
import { CommonService } from 'src/app/_service/common.service';

@Component({
  selector: 'app-ongoing-trip',
  templateUrl: './ongoing-trip.page.html',
  styleUrls: ['./ongoing-trip.page.scss'],
})
export class OngoingTripPage implements OnInit {
  userDetails: any = [];
  activeTrip: any = [];
  activeDriver: any = [];

  constructor(private api: ApiService, private common: CommonService) {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        console.log('userDetails:', this.userDetails);
      }
    });
  }

  ngOnInit() {
    this.getActiveTrip(this.userDetails.customer_number);
    this.getActiveDriver(this.userDetails.customer_number);
  }

  getActiveTrip(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log('params:', params);

    this.api.post('active_trip_taxi', params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log('responseData:', responseData);
        if (responseData.status === true) {
          this.activeTrip = responseData.all_taxibooking;
          console.log('activeTrip:', this.activeTrip);
        } else {
          console.log('false');
        }
      },
      (err) => {
        console.log('err:', err);
        const toastMsg = 'Something went wrong, please try again later !';
        const toastTime = 2000;
        this.common.presentToast(toastMsg, toastTime);
      }
    );
  }

  getActiveDriver(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log('params:', params);
    this.api.post('active_trip_driver', params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log('responseData:', responseData);
        if (responseData.status === true) {
          this.activeDriver = responseData.all_driverbooking;
          console.log('activeDriver:', this.activeDriver);
        } else {
          console.log('false');
        }
      },
      (err) => {
        console.log('err:', err);
        const toastMsg = 'Something went wrong, please try again later !';
        const toastTime = 2000;
        this.common.presentToast(toastMsg, toastTime);
      }
    );
  }

  gotoPage(page: string) {
    const p = page;
    const navigationExtras: NavigationExtras = {
      state: {
        userInfo: this.userDetails,
      },
    };
    this.common.router.navigate([p], navigationExtras);
  }
}
