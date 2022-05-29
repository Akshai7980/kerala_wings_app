/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../_service/api.service';
import { CommonService } from '../../_service/common.service';
import { StorageService } from '../../_service/storage.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  updateForm: FormGroup;
  userDetails: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private storage: StorageService,
    public common: CommonService,
    private api: ApiService,
  ) {
    this.updateForm = this.formBuilder.group({
      first_name: ['', [ Validators.required, Validators.min(3) ]],
      last_name: ['', [ Validators.required, Validators.min(1) ]],
      phone_no: ['', [ Validators.required, Validators.min(10), Validators.pattern('^[0-9]+$') ]],
      driver_type: ['', [ Validators.required ]],
      address: ['', [ Validators.required, Validators.min(3) ]],
      licence_no: ['', [ Validators.required, Validators.min(3), Validators.pattern('^[0-9]+$') ]],
      adhar: ['', [ Validators.required, Validators.min(16), Validators.pattern('^[0-9]+$') ]],
      dob: ['', [ Validators.required, Validators.min(5) ]],
      home_mobile: ['', [ Validators.required, Validators.min(10), Validators.pattern('^[0-9]+$') ]],
      driver_id: [''],
    });
   }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    console.log('userdetails:');
    this.storage.storage.get('USER_DETAILS').then((val) => {
      if (val) {
        this.userDetails = val;
        console.log('userdetails:', this.userDetails);
        this.updateForm.get('driver_id').setValue(this.userDetails.id);
      }
    });
  }

  submitProfile() {
    console.log('form:',this.updateForm.value);
    if (this.updateForm.valid) {
      const loadingMsg = 'We are updating your profile details, please wait...';
      this.common.simpleLoader(loadingMsg);
      this.api.post('driver_profile', this.updateForm.value).then((res: any) => {
        console.log('res:',res);
        const responseData = JSON.parse(res.data);
        if (responseData.status === true) {
          const toastMsg = 'Your profile updated successfully.';
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
          this.common.router.navigate(['/tabs/tab3']);
          this.common.dismissLoader();
        } else {
          console.log('false');
        }
      }, err => {
        console.log('err:',err);
        const toastMsg = 'Something went wrong, please try again later !';
        const toastTime = 2000;
        this.common.presentToast(toastMsg, toastTime);
        this.common.dismissLoader();
      });
    } else {
      console.log('form not valid');
      const alertHead = 'Failed!';
      const alertMsg = 'All fields are mandatory, please fill all fields and then click update.';
      this.common.presentAlert(alertHead, alertMsg);
    }
  }

  onDismissModal() {
    this.common.modalCtrl.dismiss();
    this.storage.setStorage('USER_DETAILS_MODAL', 'isOnceClosed');
  }

}
