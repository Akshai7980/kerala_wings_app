/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../_service/api.service';
import { CommonService } from '../_service/common.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.page.html',
  styleUrls: ['./apply-leave.page.scss'],
})
export class ApplyLeavePage implements OnInit {
  leaveForm: FormGroup;
  userDetails: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    private api: ApiService
  ) {
    this.common.route.queryParams.subscribe((params) => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails =
          this.common.router.getCurrentNavigation().extras.state.userInfo;
      }
    });

    this.leaveForm = this.formBuilder.group({
      driver_id: [''],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      leave_type: ['Full Day', [Validators.required]],
    });
  }

  ngOnInit() {
    this.leaveForm.get('driver_id').setValue(this.userDetails?.id);
  }

  doSomething(e, type) {
    if (type === 'FROM') {
      const from = e.detail.value.split('T')[0];
      this.leaveForm.get('start_date').setValue(from);
    } else {
      const to = e.detail.value.split('T')[0];
      this.leaveForm.get('end_date').setValue(to);
    }
    this.common.modalCtrl.dismiss();
  }

  submitLeave() {
    if (this.leaveForm.valid) {
      if (this.common.platform.is('cordova')) {
        const loadingMsg =
          'Please wait we are trying to apply your leave. Don`t press back while we are applying...';
        this.common.simpleLoader(loadingMsg);
        this.api.post('driver_leave', this.leaveForm.value).then(
          (res: any) => {
            const responseData = JSON.parse(res.data);
            if (responseData.status === true) {
              const toastMsg = 'Your leave applied successfully.';
              const toastTime = 2000;
              this.common.presentToast(toastMsg, toastTime);
              this.common.router.navigate(['/tabs/tab2']);
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
        this.common.router.navigate(['/tabs/tab2']);
      }
    } else {
      const alertHead = 'Failed!';
      const alertMsg = 'Please enter details and then apply for leave.';
      this.common.presentAlert(alertHead, alertMsg);
    }
  }
}
