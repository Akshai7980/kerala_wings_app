import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-details',
  templateUrl: './social-details.page.html',
  styleUrls: ['./social-details.page.scss'],
})
export class SocialDetailsPage implements OnInit {
  @Input() whichSocialMedia: string;

  constructor() {}

  ngOnInit() {
    console.log('whichSocialMedia:', this.whichSocialMedia);
    if (this.whichSocialMedia === 'mail') {
      console.log('G mail clicked');
    }
  }
}
