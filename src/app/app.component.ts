/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { Platform, NavController } from "@ionic/angular";
import { StorageService } from "./_service/storage.service";
import { CommonService } from "./_service/common.service";
import { LogoutPage } from "./_modal/logout/logout.page";
import { ApiService } from "./_service/api.service";
import { LocalNotifications } from "@awesome-cordova-plugins/local-notifications/ngx";
// import { BackgroundMode } from "@awesome-cordova-plugins/background-mode/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  userDetails: any = [];

  public appPages = [
    {
      title: "Dashboard",
      url: "/tabs/tab2",
      icon: "grid",
    },
    {
      title: "Profile",
      url: "/tabs/tab3",
      icon: "person-circle",
    },
    {
      title: "Apply Leave",
      url: "/apply-leave",
      icon: "newspaper",
    },
    {
      title: "Leave History",
      url: "/leave-history",
      icon: "calendar-number",
    },
    {
      title: "Trip Details",
      url: "/tabs/tab1",
      icon: "location",
    },
    {
      title: "Terms & Conditions",
      url: "/terms-and-condition",
      icon: "document-text",
    },
    {
      title: "Logout",
      url: "/login",
      icon: "exit",
    },
  ];
  tripDetails: any;
  constructor(
    private router: Router,
    private platform: Platform,
    private navCtrl: NavController,
    private store: StorageService,
    private common: CommonService,
    private api: ApiService,
    private localNotifications: LocalNotifications,
    // private backgroundMode: BackgroundMode
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.api.httpNative
        .setServerTrustMode("pinned")
        .then(() => {
          this.simpleNotif();
          this.toGetUserRole();
          console.log("Congratulations, you have set up SSL Pinning.");
          // this.backgroundMode.enable();
          // console.log("backgroundMode enabled");
        })
        .catch(() => {
          console.error("Opss, SSL pinning failed.");
        });
    });
  }

  toGetUserRole() {
    this.store.storage
      .get("ROLE")
      .then(async (val) => {
        if (!val) {
          console.log("val:", val);
          await this.navCtrl.navigateRoot("/landing");
        } else {
          if (val === "driver") {
            this.checkDriverDetails();
          } else {
            this.checkUserDetails();
          }
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }

  simpleNotif() {
    this.localNotifications.schedule({
      id: 1,
      title: "Kerala Wings App",
      text: " "+ this.userDetails.first_name === undefined ? this.userDetails.first_name : ' Hai... user' + ", we keeps you updated for active trips...",
      smallIcon: 'res://ic_launcher.png',
      // sound: this.platform.is("android")
      // ? "file://assets/tune-android/Antique-Phone.mp3"
      // : "file://beep.caf",
      // data: { secret: 'secret' },
      // icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzfXKe6Yfjr6rCtR6cMPJB8CqMAYWECDtDqH-eMnerHHuXv9egrw",
      icon: "res://ic_launcher.png",
      group: 'trip',
      sticky: true,
      autoClear: false,
      lockscreen: true,
      foreground: true,
      launch: true,
      priority: 2,
      led: 'FF0000',
      vibrate: true,
      // attachments: [],
      // actions:[],
      // trigger: {
      //   every: {
      //     minute: 15
      //   },
      // }
    });
  }

  checkDriverDetails() {
    this.store.storage
      .get("USER_DETAILS")
      .then(async (val) => {
        if (val) {
          this.userDetails = val;
          console.log("userDetails:", this.userDetails);
          await this.navCtrl.navigateRoot("/tabs/tab2");
        } else {
          console.log("val:", val);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }

  checkUserDetails() {
    this.store.storage
      .get("USER_DETAILS")
      .then(async (val) => {
        if (val) {
          this.userDetails = val;
          console.log("userDetails:", this.userDetails);
          await this.navCtrl.navigateRoot("/user-dashborad");
        } else {
          console.log("val:", val);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }

  openPage(i: any) {
    if (this.appPages[i]?.title === "Logout") {
      console.log("logout clicked");
      this.presentLogoutModal();
    } else {
      const route = this.appPages[i].url;
      const navigationExtras: NavigationExtras = {
        state: {
          userInfo: this.userDetails,
          trip: this.tripDetails,
        },
      };
      this.router.navigate([route], navigationExtras);
    }
  }

  async presentLogoutModal() {
    const modal = await this.common.modalCtrl.create({
      component: LogoutPage,
      cssClass: "logout-modal",
    });
    return await modal.present();
  }

  doRefresh(event: any) {
    this.store.storage.get("USER_DETAILS").then((val) => {
      this.userDetails = val;
    });

    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }

  ionWillOpen(event: any) {
    this.store.storage.get("USER_DETAILS").then((val) => {
      this.userDetails = val;
      this.getTripDetails(this.userDetails);
    });
  }

  getTripDetails(details: any) {
    const params = {
      driver_id: details.id,
    };
    this.api.post("active_trip", params).then(
      (res: any) => {
        const responseData = JSON.parse(res.data);
        if (responseData.status === true) {
          this.tripDetails = responseData.active_trip;
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  }
}
