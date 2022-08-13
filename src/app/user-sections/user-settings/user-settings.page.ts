import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {
  settings: any = [];

  constructor(
    public plt: Platform
  ) { }

  ngOnInit() {
    this.settings.length = 10;
  }

}
