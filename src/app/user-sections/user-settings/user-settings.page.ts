import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/_service/common.service";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.page.html",
  styleUrls: ["./user-settings.page.scss"],
})
export class UserSettingsPage implements OnInit {
  constructor(private common: CommonService) {}

  ngOnInit() {
    this.common.simpleLoader('');
    setTimeout(() => {
      this.common.loadingCtrl.dismiss();
    }, 2000);
  }
}
