import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  contactUs: any = [];

  constructor() {}

  ngOnInit() {
    this.getContactUsJSON();
  }

  getContactUsJSON() {
    fetch('../../assets/contactUs.json')
      .then((res) => res.json())
      .then((json) => {
        this.contactUs = json;
        console.log('allDays: ', this.contactUs);
      });
  }
}
