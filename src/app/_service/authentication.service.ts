import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { ToastController, Platform } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  authState = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private platform: Platform,
    public common: CommonService,
    public toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  ifLoggedIn() {
    this.storage.get("USER_INFO").then((response) => {
      if (response) {
        this.authState.next(true);
      }
    });
  }

  login(userDetails: any) {
    const dummy_response = {
      userId: userDetails?.id,
      userName: userDetails?.first_name,
      token: userDetails?.token,
      type: userDetails?.type,
      address: userDetails?.address,
      mobileNumber: userDetails?.phone_no,
    };
    this.storage.set("USER_INFO", dummy_response).then((response) => {
      if (response) {
        // this.router.navigate(["/tabs/tab2"]);
        console.log("response:", response);
        this.authState.next(true);
        this.common.navCtrl.navigateRoot('/tabs/tab2');
      }
    });
  }

  logout() {
    this.storage.remove("USER_INFO").then(() => {
      // this.router.navigate(["login"]);
      // this.common.navCtrl.navigateRoot('/tabs/tab2');
      this.authState.next(false);
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }
}
