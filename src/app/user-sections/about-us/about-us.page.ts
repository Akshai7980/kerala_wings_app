import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  aboutUs: any = [];

  constructor() {}

  ngOnInit() {
    this.getAboutUsJSON();
  }

  getAboutUsJSON() {
    fetch('../../assets/about.json')
      .then((res) => res.json())
      .then((json) => {
        this.aboutUs = json;
      });
  }
}
