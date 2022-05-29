import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_service/common.service';
import { StorageService } from '../_service/storage.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  profileDetails: any = [];
  userDetails: any = [];

  constructor(
    private storage: StorageService,
    public common: CommonService
  ) { }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    console.log('userdetails:');
    this.storage.storage.get('USER_DETAILS').then((val) => {
      if (val) {
        this.userDetails = val;
        console.log('userdetails:', this.userDetails);
      }
    });
  }
}
