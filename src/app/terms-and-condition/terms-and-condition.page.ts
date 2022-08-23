import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_service/common.service';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.page.html',
  styleUrls: ['./terms-and-condition.page.scss'],
})
export class TermsAndConditionPage implements OnInit {
  userDetails: any = [];

  constructor(
    public common: CommonService,
  ) {
    this.common.route.queryParams.subscribe(params => {
      if (this.common.router.getCurrentNavigation().extras.state) {
        this.userDetails = this.common.router.getCurrentNavigation().extras.state.userInfo;
        console.log('userDetails:',this.userDetails);
      }
    });
   }

  ngOnInit() {
  }

}
