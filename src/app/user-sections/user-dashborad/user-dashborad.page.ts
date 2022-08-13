/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { CallNumber } from "@awesome-cordova-plugins/call-number/ngx";
import { LogoutPage } from "src/app/_modal/logout/logout.page";
import { SocialDetailsPage } from "src/app/_modal/social-details/social-details.page";
import { ApiService } from "src/app/_service/api.service";
import { CommonService } from "src/app/_service/common.service";
import { StorageService } from "src/app/_service/storage.service";

@Component({
  selector: "app-user-dashborad",
  templateUrl: "./user-dashborad.page.html",
  styleUrls: ["./user-dashborad.page.scss"],
})
export class UserDashboradPage implements OnInit {
  interval: any;
  welcomeText: string;
  userDetails: any = [];
  activeTrip: any = [];
  activeDriver: any = [];
  allBooking: any = [];
  allBookingTaxi: any = [];

  constructor(
    private common: CommonService,
    private api: ApiService,
    private storage: StorageService,
    private callNumber: CallNumber
  ) {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        console.log("userDetails:", this.userDetails);
      }
    });
  }

  ngOnInit() {
    this.common.menu.swipeGesture(false);
    this.welcomeText = "want to go?";
    this.interval = setInterval(() => {
      if (this.welcomeText === "want to go?") {
        this.welcomeText = "want to travel?";
      } else if (this.welcomeText === "want to travel?") {
        this.welcomeText = "want to go by car?";
      } else if (this.welcomeText === "want to go by car?") {
        this.welcomeText = "want to book a driver?";
      } else if (this.welcomeText === "want to book a driver?") {
        this.welcomeText = "want to go?";
      }
    }, 3000);
    // this.getUserDetails();
    this.getCalculateDays();
  }

  getCalculateDays() {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    console.log(date);
  }

  ionViewWillEnter() {
    // this.getActiveTrip(this.userDetails.customer_number);
    // this.getActiveDriver(this.userDetails.customer_number);
    this.getUserDetails();
  }

  getUserDetails() {
    this.storage.storage.get("USER_DETAILS").then((val) => {
      if (val) {
        this.userDetails = val;
        console.log("userDetails:", this.userDetails);
        this.getAllBookingDriver(this.userDetails.customer_number);
        this.getAllBookingCab(this.userDetails.customer_number);
        this.getActiveTrip(this.userDetails.customer_number);
        this.getActiveDriver(this.userDetails.customer_number);
      }
    });
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
    this.api.post("active_trip_taxi", params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log("responseData:", responseData);
        if (responseData.status === true) {
          this.activeTrip = responseData.all_taxibooking;
          console.log("activeTrip:", this.activeTrip);
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
    this.api.post("active_trip_driver", params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log("responseData:", responseData);
        if (responseData.status === true) {
          this.activeDriver = responseData.all_driverbooking;
          console.log("activeDriver:", this.activeDriver);
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

  gotoPage(page: string, type: string, trip: any) {
    const p = page;
    console.log('trip:',trip);
    const navigationExtras: NavigationExtras = {
      state: {
        userInfo: this.userDetails,
        clickedType: type,
        tripDetails: trip
      },
    };
    this.common.router.navigate([p], navigationExtras);
  }

  async socialSection(socialApp: string) {
    console.log("socialApp:", socialApp);
    const modal = await this.common.modalCtrl.create({
      component: SocialDetailsPage,
      breakpoints: [0.5],
      initialBreakpoint: 0.5,
      componentProps: {
        whichSocialMedia: socialApp,
      },
    });
    return await modal.present();
  }

  async presentLogoutModal() {
    const modal = await this.common.modalCtrl.create({
      component: LogoutPage,
      cssClass: "logout-modal",
    });
    return await modal.present();
  }

  callTripClient() {
    this.callNumber
      .callNumber("+91 9037502502", true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
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
}
