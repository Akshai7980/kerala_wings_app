/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/_service/api.service";
import { CommonService } from "src/app/_service/common.service";

@Component({
  selector: "app-trip-history",
  templateUrl: "./trip-history.page.html",
  styleUrls: ["./trip-history.page.scss"],
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
        console.log("userDetails:", this.userDetails);
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
    console.log("params:", params);
    this.api.postApiCall("list_all_booking_taxi_closed", params).subscribe(
      (res: any) => {
        console.log("res:", res);
        if (res.status === true && res.all_taxibooking.length > 0) {
          this.closedTrip = [];
          const allTaxiBooking = res.all_taxibooking;
          for (let i = 0; i < allTaxiBooking.length; i++) {
            if (allTaxiBooking[i].trip_status === 2) {
              // trip status is 2 means, the booked trip is closed
              this.closedTrip.push(allTaxiBooking[i]);
            }
          }
          console.log("closedTrip:", this.closedTrip);
        } else {
          console.log("false");
          this.closedTrip = [];
          this.skeleton.length = 0;
        }
      },
      (err) => {
        console.log("err:", err);
        const toastMsg = "Something went wrong, please try again later !";
        const toastTime = 2000;
        this.common.presentToast(toastMsg, toastTime);
      }
    );
  }

  getClosedDriver(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log("params:", params);
    this.api.postApiCall("list_all_booking_closed", params).subscribe(
      (res: any) => {
        console.log("res:", res);
        if (res.status === true && res.all_driverbooking.length > 0) {
          this.closedDriver = [];
          const allDriverBooking = res.all_driverbooking;
          for (let i = 0; i < allDriverBooking.length; i++) {
            if (allDriverBooking[i].trip_status === 2) {
              // trip status is 2 means, the booked trip is closed
              this.closedDriver.push(allDriverBooking[i]);
            }
          }
          console.log("closedDriver:", this.closedDriver);
        } else {
          console.log("false");
          this.closedDriver = [];
          this.skeleton.length = 0;
        }
      },
      (err) => {
        console.log("err:", err);
        const toastMsg = "Something went wrong, please try again later !";
        const toastTime = 2000;
        this.common.presentToast(toastMsg, toastTime);
      }
    );
  }
}
