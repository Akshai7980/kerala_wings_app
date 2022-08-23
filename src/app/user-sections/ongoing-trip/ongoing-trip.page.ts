/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { ApiService } from "src/app/_service/api.service";
import { CommonService } from "src/app/_service/common.service";

@Component({
  selector: "app-ongoing-trip",
  templateUrl: "./ongoing-trip.page.html",
  styleUrls: ["./ongoing-trip.page.scss"],
})
export class OngoingTripPage implements OnInit {
  userDetails: any = [];
  activeTrip: any = [];
  activeDriver: any = [];
  viewType!: string;
  allBooking: any = [];
  allBookingTaxi: any = [];
  modeOfTrip: any;
  commonArray: any = [];

  constructor(private api: ApiService, private common: CommonService) {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        console.log("userDetails:", this.userDetails);
        this.viewType =
          this.common.router.getCurrentNavigation().extras.state.clickedType;
        console.log("viewType:", this.viewType);
        this.commonArray =
          this.common.router.getCurrentNavigation().extras.state.tripDetails;
        console.log("commonArray:", this.commonArray);
        this.modeOfTrip =
          this.common.router.getCurrentNavigation().extras.state.modeOfTrip;
        console.log("modeOfTrip:", this.modeOfTrip);
      }
    });
  }

  ngOnInit() {
    console.log("viewType:", this.viewType);
    if (this.viewType === "ongoing") {
      this.getActiveTrip(this.userDetails.customer_number);
      this.getActiveDriver(this.userDetails.customer_number);
    } else if (this.viewType === "details") {
      if (this.modeOfTrip === "driver" && this.modeOfTrip !== "") {
        this.activeDriver[0] = this.commonArray;
      } else {
        this.activeTrip[0] = this.commonArray;
      }
    }
    // this.getAllBookingDriver(this.userDetails.customer_number);
    // this.getAllBookingCab(this.userDetails.customer_number);
  }

  getAllBookingDriver(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log("params:", params);
    this.api.post("list_all_booking", params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log("responseData:", responseData);
        if (responseData.status === true) {
          this.allBooking = responseData.all_driverbooking;
          console.log("allBooking:", this.allBooking);
        } else {
          console.log("false");
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

  getAllBookingCab(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log("params:", params);
    this.api.post("list_all_booking_taxi", params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log("responseData:", responseData);
        if (responseData.status === true) {
          this.allBookingTaxi = responseData.all_taxibooking;
          console.log("allBookingTaxi:", this.allBookingTaxi);
        } else {
          console.log("false");
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

  getActiveTrip(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log("params:", params);

    this.api.postApiCall("list_all_booking_taxi", params).subscribe(
      (res: any) => {
        console.log("res:", res);
        if (res.status === true) {
          const allTaxiBooking = res.all_taxibooking;
          for (let i = 0; i < allTaxiBooking.length; i++) {
            if (allTaxiBooking[i].trip_status === 1) {
              // trip status is 1 means, the booked trip is active
              this.activeTrip.push(allTaxiBooking[i]);
              console.log("activeTrip:", this.activeTrip);
            }
          }
        } else {
          console.log("false");
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

  getActiveDriver(mobileNumber: string) {
    const params = {
      customer_number: mobileNumber,
    };
    console.log("params:", params);
    this.api.postApiCall("list_all_booking_closed", params).subscribe(
      (res: any) => {
        console.log("res:", res);
        if (res.status === true) {
          const allDriverBooking = res.all_driverbooking;
          for (let i = 0; i < allDriverBooking.length; i++) {
            if (allDriverBooking[i].trip_status === 1) {
              // trip status is 1 means, the booked trip is active
              this.activeDriver.push(allDriverBooking[i]);
              console.log("activeDriver:", this.activeDriver);
            }
          }
        } else {
          console.log("false");
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

  toCancelTrip(tripDetails: any, type: string) {
    console.log("tripDetails:", tripDetails);
    const alertHead = "Alert!";
    const alertMsg = "Are you sure you want to cancel the booked trip.";
    this.presentAlertConfirm(alertHead, alertMsg, tripDetails, type);
  }

  async presentAlertConfirm(head, msg, tripDetails, type) {
    const alert = await this.common.alertCtrl.create({
      header: head,
      message: msg,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          id: "cancel-button",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          id: "confirm-button",
          handler: () => {
            console.log("Confirm Okay");
            this.tripCancelConfirmed(tripDetails, type);
          },
        },
      ],
    });

    await alert.present();
  }

  tripCancelConfirmed(tripDetails, type) {
    console.log("tripDetails:", tripDetails, type);
    if (type === "DRIVER") {
      const params = {
        trip_id: tripDetails?.id,
      };
      console.log("params:", params);
      this.api.postApiCall("cancel_driver_booking", params).subscribe(
        (res: any) => {
          console.log("res:", res);
          if (res.status === true) {
            const toastMsg = "Your driver booking cancelled successfully.";
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
            this.getAllBookingDriver(tripDetails.customer_number);
          } else {
            console.log("false");
            const toastMsg = "Your driver booking cancellation failed.";
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
          }
        },
        (err) => {
          console.log("err:", err);
          const toastMsg = "Something went wrong, please try again later !";
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
        }
      );
    } else {
      const params = {
        trip_id: tripDetails?.id,
      };
      console.log("params:", params);
      this.api.postApiCall("cancel_taxi_booking", params).subscribe(
        (res: any) => {
          console.log("res:", res);
          if (res.status === true) {
            const toastMsg = "Your cab booking cancelled successfully.";
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
            this.getAllBookingCab(tripDetails.customer_number);
          } else {
            console.log("false");
            const toastMsg = "Your cab booking cancellation failed.";
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
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
