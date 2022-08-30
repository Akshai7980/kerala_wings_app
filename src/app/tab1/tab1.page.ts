/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable no-var */
/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../_service/api.service";
import { CommonService } from "../_service/common.service";
import { StorageService } from "../_service/storage.service";
import { CallNumber } from "@awesome-cordova-plugins/call-number/ngx";
import { TripClosingPage } from "../_modal/trip-closing/trip-closing.page";
@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  tripDetails: any = [];
  userDetails: any = [];
  interval: any;
  hideSkeleton: boolean;
  displayDay: string;

  constructor(
    private api: ApiService,
    private common: CommonService,
    private storage: StorageService,
    private callNumber: CallNumber
  ) {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        this.tripDetails =
          this.common.router.getCurrentNavigation().extras.state.trip;
      }
    });
  }

  ngOnInit() {
    this.getUserDetails();
  }

  ionViewWillEnter() {
    this.getUserDetails();
  }

  ionViewWillLeave() {
    clearInterval(this.interval);
  }

  doRefresh(event: any) {
    this.getTripDetails(this.userDetails);

    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

  getUserDetails() {
    this.storage.storage.get("USER_DETAILS").then((val) => {
      if (val) {
        this.userDetails = val;
        this.interval = setInterval(() => {
          this.getTripDetails(this.userDetails);
        }, 5000);
      }
    });
  }

  trackByFn(item: any): number {
    return item.serialNumber;
  }

  getTripDetails(details: any) {
    const params = {
      driver_id: details.id,
    };
    console.log("params:", params);
    this.api.post("active_trip", params).then(
      (res: any) => {
        console.log("res:", res);
        const responseData = JSON.parse(res.data);
        console.log("responseData:", responseData);
        if (responseData.status === true) {
          console.log("Type:", this.userDetails.type);
          if (this.userDetails.type === "Taxi Driver") {
            this.tripDetails = [];
            for (let i = 0; i < responseData.active_trip_taxi.length; i++) {
              this.tripDetails.push(responseData.active_trip_taxi[i]);
            }
          } else {
            this.tripDetails = [];
            for (let i = 0; i < responseData.active_trip.length; i++) {
              this.tripDetails.push(responseData.active_trip[i]);
            }
          }
          console.log("tripDetails:", this.tripDetails);
          if (this.tripDetails.length > 0) {
            if (this.tripDetails[0]?.driver_view_status === 0) {
              this.updateTripSeenStatus(this.tripDetails[0]?.id);
            } else {
              console.log("seen status updated already");
            }
            console.log("tripDetails:", this.tripDetails);
            this.hideSkeleton = false;
            this.getTodayDate();
            this.getYesterdayDate();
            this.getTomorrowDate();
            this.getDayOfPastTrip();
          }
        } else {
          this.tripDetails = [];
          setTimeout(() => {
            this.hideSkeleton = true;
          }, 100);
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  updateTripSeenStatus(tripId: any) {
    this.common.simpleLoader("");
    console.log("tripId:", tripId);
    const toastMsg =
      " ⏳ Please wait while we are updating your trip view status. ";
    const toastTime = 5000;
    this.common.presentToast(toastMsg, toastTime);
    const params = {
      trip_id: tripId,
      driver_view_status: "1", // status no: 1 is used to update trip seen status
    };
    this.api.post("update_driver_view_status", params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        if (responseData.status === true) {
          this.common.loadingCtrl.dismiss();
          console.log("seen status updated");
        } else {
          this.common.loadingCtrl.dismiss();
          console.log("updating failed");
        }
      },
      (err) => {
        this.common.loadingCtrl.dismiss();
        console.log("err", err);
      }
    );
  }

  getTodayDate() {
    const dt = new Date();
    const today = dt.toDateString();
    const bookingDateToGMT = new Date(this.tripDetails[0]?.booking_date);
    const bookingDate = bookingDateToGMT.toDateString();
    if (bookingDate === today) {
      return (this.displayDay = "Today");
    }
  }

  getYesterdayDate() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const bookingDateToGMT = new Date(this.tripDetails[0]?.booking_date);
    if (bookingDateToGMT.toDateString() === yesterday.toDateString()) {
      return (this.displayDay = "Yesterday");
    }
  }

  getTomorrowDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bookingDateToGMT = new Date(this.tripDetails[0]?.booking_date);
    if (bookingDateToGMT.toDateString() === tomorrow.toDateString()) {
      return (this.displayDay = "Tomorrow");
    }
  }

  getDayOfPastTrip() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const bookingDateToGMT = new Date(this.tripDetails[0]?.booking_date);
    if (
      bookingDateToGMT.toDateString() !== today.toDateString() &&
      bookingDateToGMT.toDateString() !== tomorrow.toDateString() &&
      bookingDateToGMT.toDateString() !== yesterday.toDateString()
    ) {
      return (this.displayDay =
        "Last " +
        bookingDateToGMT.toLocaleDateString("en-US", { weekday: "long" }));
    }
  }

  callTripClient(tripDetails: any) {
    console.log("tripDetails:", tripDetails);
    this.callNumber
      .callNumber(tripDetails?.customer_number, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  // To show trip amount inserting modal
  async closeTripModal(tripDetails: any) {
    console.log("tripDetails:", tripDetails);
    const modal = await this.common.modalCtrl.create({
      component: TripClosingPage,
      cssClass: "close-trip-modal",
      componentProps: {
        driverId: tripDetails?.driver_id,
        tripId: tripDetails?.id,
      },
    });
    return await modal.present();
  }

  // To start assigned trip
  toStartTrip(tripId: any) {
    console.log("tripId:", tripId);
    const params = {
      trip_id: tripId,
      driver_view_status: "2", // status no: 2 is used to start trip
    };
    this.api.post("update_driver_view_status", params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        if (responseData.status === true) {
          console.log("trip start status updated");
        } else {
          console.log("updating failed");
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  }
}
