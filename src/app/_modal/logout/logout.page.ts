import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/_service/common.service';
import { StorageService } from 'src/app/_service/storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
  constructor(private common: CommonService, private storage: StorageService) {}

  ngOnInit() {}

  userClicked(decision: string) {
    if (decision === 'YES') {
      this.common.navCtrl.navigateRoot('/landing');
      this.storage.clearStorage();
      this.common.modalCtrl.dismiss();
    } else {
      this.common.modalCtrl.dismiss();
    }
  }
}
