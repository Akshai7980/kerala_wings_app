import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/_service/Authentication.service";
import { CommonService } from "src/app/_service/common.service";
import { StorageService } from "src/app/_service/storage.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.page.html",
  styleUrls: ["./logout.page.scss"],
})
export class LogoutPage implements OnInit {
  constructor(
    private common: CommonService,
    private storage: StorageService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {}

  userClicked(decision: string) {
    if (decision === "YES") {
      this.common.navCtrl.navigateRoot("/landing");
      this.storage.clearStorage();
      this.common.modalCtrl.dismiss();
      this.authService.logout();
    } else {
      this.common.modalCtrl.dismiss();
    }
  }
}
