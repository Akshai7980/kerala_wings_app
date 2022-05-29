import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {
  settings: any = [];

  constructor() { }

  ngOnInit() {
    this.settings.length = 10;
  }

}
