/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "src/app/_service/api.service";
import { CommonService } from "src/app/_service/common.service";

@Component({
  selector: "app-booking",
  templateUrl: "./booking.page.html",
  styleUrls: ["./booking.page.scss"],
})
export class BookingPage implements OnInit {
  userDetails: any = [];
  allDays: any = [];
  allVehicles: any = [];
  segmentChoosed: string;
  dateChoosed: string;
  numberOfDays: string;
  endDateChoosed: string;

  cabBookingForm = new FormGroup({
    vehicle_type: new FormControl(undefined, [Validators.required]),
    destination: new FormControl(undefined, [Validators.required]),
    booking_date: new FormControl(undefined, [Validators.required]),
    no_day: new FormControl(undefined, [Validators.required]),
    end_date: new FormControl(undefined, [Validators.required]),
    timepicker: new FormControl(undefined, [Validators.required]),
    remark: new FormControl(undefined, [Validators.minLength(1)]),
  });

  driverBookingForm = new FormGroup({
    destination: new FormControl(undefined, [Validators.required]),
    booking_date: new FormControl(undefined, [Validators.required]),
    no_day: new FormControl(undefined, [Validators.required]),
    end_date: new FormControl(undefined, [Validators.required]),
    vehicle_name: new FormControl(undefined, [Validators.required]),
    vehicle_type: new FormControl(undefined, [Validators.required]),
    vehicle_number: new FormControl(undefined, [Validators.required]),
    timepicker: new FormControl(undefined, [Validators.required]),
    driver: new FormControl(undefined, [Validators.minLength(3)]),
    remark: new FormControl(undefined, [Validators.minLength(1)]),
  });
  timeChoosed: string;

  constructor(private common: CommonService, private api: ApiService) {}

  ngOnInit() {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        this.segmentChoosed =
          this.common.router.getCurrentNavigation().extras.state.clickedType;
        console.log("userDetails:", this.userDetails);
        console.log("segmentChoosed:", this.segmentChoosed);
      }
    });
    if (!this.segmentChoosed) {
      this.segmentChoosed = "driver";
    }
    const today = new Date();
    console.log("today:", today.toISOString().split("T")[0]);

    this.getNumberOfDaysJSON();
    this.getAllVehicles();
    this.cabBookingForm.controls["booking_date"].setValue(
      today.toISOString().split("T")[0]
    );
    this.cabBookingForm.controls["timepicker"].setValue(
      new Date().toLocaleTimeString("en-US")
    );
    this.cabBookingForm.controls["no_day"].setValue("1");
    this.cabBookingForm.controls["vehicle_type"].setValue("Automatic");
    if (this.cabBookingForm.value.no_day === "1") {
      this.cabBookingForm.controls["end_date"].setValue(
        today.toISOString().split("T")[0]
      );
    }

    this.driverBookingForm.controls["booking_date"].setValue(
      today.toISOString().split("T")[0]
    );
    // this.driverBookingForm.controls["timepicker"].setValue(
    //   new Date().toLocaleTimeString("en-US")
    // );
    // this.timeChoosed = new Date().toLocaleTimeString("en-US");
    // console.log('timepicker:',this.driverBookingForm.value.timepicker);
    this.driverBookingForm.controls["no_day"].setValue("1");
    if (this.driverBookingForm.value.no_day === "1") {
      this.driverBookingForm.controls["end_date"].setValue(
        today.toISOString().split("T")[0]
      );
    }

    if (
      this.userDetails.vehicle_name &&
      this.userDetails.vehicle_name !== "null"
    ) {
      this.driverBookingForm.controls["vehicle_name"].setValue(
        this.userDetails.vehicle_name
      );
    }

    if (this.userDetails.vehicle && this.userDetails.vehicle !== "null") {
      this.driverBookingForm.controls["vehicle_type"].setValue(
        this.userDetails.vehicle
      );
    }

    if (
      this.userDetails.vehicle_number &&
      this.userDetails.vehicle_number !== "null"
    ) {
      this.driverBookingForm.controls["vehicle_number"].setValue(
        this.userDetails.vehicle_number
      );
    }
  }

  getNumberOfDaysJSON() {
    fetch("../../assets/days.json")
      .then((res) => res.json())
      .then((json) => {
        this.allDays = json.days;
        console.log("allDays: ", this.allDays);
      });
  }

  getAllVehicles() {
    this.api.get("vehicle_list").subscribe(
      (res: any) => {
        if (res.vehiclelist.length !== 0) {
          this.allVehicles = res.vehiclelist;
          console.log("allVehicles:", this.allVehicles);
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

  segmentChanged(event: any) {
    this.segmentChoosed = event.detail.value;
    this.endDateChoosed = "";
  }

  submitCab() {
    console.log("cabBooking:", this.cabBookingForm.value);
    if (this.cabBookingForm.valid) {
      this.common.simpleLoader("");
      const params = {
        customer_name: this.userDetails.customer_name,
        customer_number: this.userDetails.customer_number,
        landnumber: this.userDetails.landnumber,
        address: this.userDetails.address,
        vehicle_name: this.userDetails.vehicle_name,
        vehicle_type: this.userDetails.vehicle,
        destination: this.cabBookingForm.value.destination,
        vehicle: this.userDetails.vehicle,
        remarks: this.cabBookingForm.value.remark,
        no_day: this.cabBookingForm.value.no_day,
        location: this.userDetails.location,
        driver: 0,
        booking_date: this.cabBookingForm.value.booking_date,
        timepicker: this.cabBookingForm.value.timepicker,
        end_date: this.cabBookingForm.value.end_date,
      };
      console.log("params:", params);
      this.api.post("api_taxibooking_save", params).then(
        (res: any) => {
          const responseData = JSON.parse(res.data);
          console.log("responseData:", responseData);
          if (responseData.status === true) {
            const toastMsg = "Your cab had successfully booked.";
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
      const alertMsg = "Please enter valid details and then book cab.";
      this.common.presentAlert(alertHead, alertMsg);
      this.common.dismissLoader();
    }
  }

  submitDriver() {
    console.log("driverBooking:", this.driverBookingForm.value);
    if (this.driverBookingForm.valid) {
      if (this.driverBookingForm.value.vehicle_type !== 'select') {
        this.common.simpleLoader("");
        const params = {
          customer_name: this.userDetails.customer_name,
          customer_number: this.userDetails.customer_number,
          landnumber: this.userDetails.landnumber,
          address: this.userDetails.address,
          vehicle_name: this.driverBookingForm.value.vehicle_name,
          vehicle_type: this.driverBookingForm.value.vehicle_type,
          vehicle_number: this.driverBookingForm.value.vehicle_number,
          destination: this.driverBookingForm.value.destination,
          vehicle: "Car",
          remarks: this.driverBookingForm.value.remark,
          no_day: this.driverBookingForm.value.no_day,
          location: this.userDetails.location,
          driver: 1,
          booking_date: this.driverBookingForm.value.booking_date,
          timepicker: this.driverBookingForm.value.timepicker,
          end_date: this.driverBookingForm.value.end_date,
        };
        console.log("params:", params);
        this.api.post("api_driverbooking_save", params).then(
          (res: any) => {
            const responseData = JSON.parse(res.data);
            console.log("responseData:", responseData);
            if (responseData.status === true) {
              const toastMsg = "Your driver had successfully booked.";
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
        const alertMsg = "Please choose a vehicle type and then click book driver.";
        this.common.presentAlert(alertHead, alertMsg);
        this.common.dismissLoader();
      }
    } else {
      const alertHead = "Failed!";
      const alertMsg = "Please enter valid details and then book driver.";
      this.common.presentAlert(alertHead, alertMsg);
      this.common.dismissLoader();
    }
  }

  doSomethingDate(event: any) {
    this.common.modalCtrl.dismiss();
    console.log("event:", event.detail.value);
    if (event) {
      this.dateChoosed = event.detail.value.split("T")[0];
      console.log("dateChoosed:", this.dateChoosed);
    }
  }

  doSomethingTime(event: any) {
    // this.common.modalCtrl.dismiss();
    console.log("event:", event.detail.value);
    if (event) {
      this.timeChoosed = event.detail.value;
      console.log("timeChoosed:", this.timeChoosed);
    }
  }

  doSomethingDays(days: any, type: string) {
    this.common.modalCtrl.dismiss();
    if (type === "cab") {
      if (days) {
        console.log("days:", days);
        this.numberOfDays = days.No;
        this.cabBookingForm.controls["no_day"].setValue(days.No);
      }
    } else {
      if (days) {
        this.numberOfDays = days.No;
        this.driverBookingForm.controls["no_day"].setValue(days.No);
      }
    }
  }

  doSomethingEndDate(event: any, type: string) {
    this.common.modalCtrl.dismiss();
    console.log("event:", event.detail.value);
    if (type === "cab") {
      if (event) {
        this.cabBookingForm.controls["end_date"].setValue(
          event.detail.value.split("T")[0]
        );
      }
    } else {
      if (event) {
        this.driverBookingForm.controls["end_date"].setValue(
          event.detail.value.split("T")[0]
        );

        // this.endDateChoosed = event.detail.value.split('T')[0];
        // console.log('endDateChoosed:', this.endDateChoosed);
      }
    }
  }
}
