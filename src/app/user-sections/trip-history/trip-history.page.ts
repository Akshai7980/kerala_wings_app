/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_service/api.service';
import { CommonService } from 'src/app/_service/common.service';

@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.page.html',
  styleUrls: ['./trip-history.page.scss'],
})
export class TripHistoryPage implements OnInit {
  userDetails: any = [];
  closedTrip: any = [];
  closedDriver: any = [];
  skeleton: any = [];

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
    this.skeleton.length = 9;
    this.getClosedTrip(this.userDetails.customer_number);
    this.getClosedDriver(this.userDetails.customer_number);
  }

  getClosedTrip(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log('params:', params);
    this.api.post('list_all_booking_taxi_closed', params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log('responseData:', responseData);
        if (responseData.status === true) {
          this.closedTrip = responseData.all_taxibooking;
          console.log('closedTrip:', this.closedTrip);
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

  getClosedDriver(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log('params:', params);
    this.api.post('list_all_booking_closed', params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log('responseData:', responseData);
        if (responseData.status === true) {
          this.closedDriver = responseData.all_driverbooking;
          console.log('closedDriver:', this.closedDriver);
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
}
