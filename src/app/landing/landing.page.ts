/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_service/common.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(
    private common: CommonService,
  ) { }

  ngOnInit() {
    this.common.menu.swipeGesture(false);
  }

  gotoPage(page) {
    console.log('page:',page);
    this.common.router.navigate([page]);
  }


}
