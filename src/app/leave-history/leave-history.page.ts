/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_service/api.service';
import { CommonService } from '../_service/common.service';

@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.page.html',
  styleUrls: ['./leave-history.page.scss'],
})
export class LeaveHistoryPage implements OnInit {
  userDetails: any = [];
  leaveHistory: any = [];
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
    this.getLeaveHistoryDetails();
    this.skeleton.length = 10;
  }

  getLeaveHistoryDetails() {
    const params = {
      driver_id: this.userDetails?.id,
    };
    console.log('params:', params);
    this.api.post('leave_history', params).then(
      (res: any) => {
        console.log('res:', res);
        const responseData = JSON.parse(res.data);
        console.log('responseData:', responseData);
        if (responseData.status === true) {
          this.leaveHistory = responseData.leave_history;
          console.log('leaveHistory:', this.leaveHistory);
        } else {
          console.log('false');
        }
      },
      (err) => {
        console.log('err', err);
        const toastMsg = 'Something went wrong, please try again later !';
        const toastTime = 2000;
        this.common.presentToast(toastMsg, toastTime);
      }
    );
  }

  // To cancel applied leave applied by drivers
  toCancelLeave(leaveDetails: any) {
    console.log('leaveDetails:', leaveDetails);
    const params = {
      id: leaveDetails.id
    };
    console.log('params:',params);
    this.api.post('', params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        console.log('responseData:', responseData);
        if (responseData.status === true) {
          const toastMsg = 'Your leave cancelled successfully!';
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
        } else {
          console.log('false');
          const toastMsg = 'Your leave cancellation failed!';
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
        }
      },
      (err) => {
        console.log('err', err);
        const toastMsg = 'Something went wrong, please try again later !';
        const toastTime = 2000;
        this.common.presentToast(toastMsg, toastTime);
      }
    );
  }
}
