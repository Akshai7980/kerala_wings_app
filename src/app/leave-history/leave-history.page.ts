/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../_service/api.service";
import { CommonService } from "../_service/common.service";

@Component({
  selector: "app-leave-history",
  templateUrl: "./leave-history.page.html",
  styleUrls: ["./leave-history.page.scss"],
})
export class LeaveHistoryPage implements OnInit {
  userDetails: any = [];
  leaveHistory: any = [];
  skeleton: any = [];

  constructor(private api: ApiService, public common: CommonService) {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
        console.log("userDetails:", this.userDetails);
      }
    });
  }

  ngOnInit() {
    this.getLeaveHistoryDetails();
    this.skeleton.length = 10;
  }

  getLeaveHistoryDetails() {
    const params = {
      driver_id: this.userDetails?.id,
    };
    console.log("params:", params);
    this.api.post("leave_history", params).then(
      async (res: any) => {
        console.log("res:", res);
        const responseData = JSON.parse(res.data);
        // console.log("responseData:", responseData);
        if (responseData.status === true && responseData.leave_history.length > 0) {
          this.leaveHistory = [];
          for (let i = 0; i < responseData.leave_history.length; i++) {
            if (
              responseData.leave_history[i].leave_type !== "" &&
              responseData.leave_history[i].lock_end !== "0" &&
              responseData.leave_history[i].lock_start !== "0"
            ) {
              this.leaveHistory.push(responseData.leave_history[i]);
            }
          }
          console.log("leaveHistory:", this.leaveHistory);
          this.leaveHistory.reverse();
        } else {
          console.log("false");
          this.leaveHistory = [];
          const toastMsg = "No leave history to show... You haven't taken any leaves yet!";
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
        }
      },
      (err) => {
        console.log("err", err);
        const toastMsg = "Something went wrong, please try again later !";
        const toastTime = 2000;
        this.common.presentToast(toastMsg, toastTime);
      }
    );
  }

  // To cancel applied leave applied by drivers
  toCancelLeave(leaveDetails: any) {
    this.common.simpleLoader("");
    console.log("leaveDetails:", leaveDetails);
    if (leaveDetails.driver_id !== "" && leaveDetails.lock_start !== "") {
      const params = {
        driverid: leaveDetails.driver_id,
        lock_start: leaveDetails.lock_start,
      };
      console.log("params:", params);
      this.api.post("Reject_leave", params).then(
        (res: any) => {
          const responseData = JSON.parse(res.data);
          console.log("responseData:", responseData);
          if (responseData.status === true) {
            this.common.loadingCtrl.dismiss();
            const toastMsg = "Your leave cancelled successfully!";
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
            this.getLeaveHistoryDetails();
          } else {
            this.common.loadingCtrl.dismiss();
            console.log("false");
            const toastMsg = "Your leave cancellation failed!";
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
          }
        },
        (err) => {
          console.log("err", err);
          const toastMsg = "Something went wrong, please try again later !";
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
        }
      );
    } else {
      const toastMsg = "Leave details are not valid. May be this leave is already cancelled by you or admin.";
      const toastTime = 2000;
      this.common.presentToast(toastMsg, toastTime);
    }

  }
}
