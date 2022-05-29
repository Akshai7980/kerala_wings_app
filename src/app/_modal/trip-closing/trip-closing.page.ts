/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_service/api.service';
import { CommonService } from 'src/app/_service/common.service';

@Component({
  selector: 'app-trip-closing',
  templateUrl: './trip-closing.page.html',
  styleUrls: ['./trip-closing.page.scss'],
})
export class TripClosingPage implements OnInit {
  @Input() driverId: number;
  @Input() tripId: number;
  tripAmount: string;

  constructor(
    private api: ApiService,
    private common: CommonService)
    {}

  ngOnInit() {}

  closeTripWithAmount() {
    if (this.tripAmount !== null && this.tripAmount !== undefined) {
      const loadingMsg = 'We are updating your trip amount, please wait...';
      this.common.simpleLoader(loadingMsg);

      const params = {
        driverid: this.driverId,
        trip_id: this.tripId,
        amount: this.tripAmount,
      };
      console.log('params:', params);
      this.api.post('close_trip_amount', params).then(
        (res: any) => {
          console.log('res:', res);
          const responseData = JSON.parse(res.data);
          console.log('responseData:', responseData);
          if (responseData.status === true) {
            this.common.modalCtrl.dismiss();
            const toastMsg = 'Successfully updated your trip amount.';
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
            this.common.router.navigate(['/tabs/tab2']);
            this.common.dismissLoader();
          } else {
            console.log('false');
            const toastMsg = 'Network issue, please try again later !';
            const toastTime = 2000;
            this.common.presentToast(toastMsg, toastTime);
            this.common.dismissLoader();
          }
        },
        (err) => {
          console.log('err:', err);
          const toastMsg = 'Something went wrong, please try again later !';
          const toastTime = 2000;
          this.common.presentToast(toastMsg, toastTime);
          this.common.dismissLoader();
        }
      );
    } else {
      const alertHead = 'Failed!';
      const alertMsg = 'Please enter trip amount.';
      this.common.presentAlert(alertHead, alertMsg);
    }
  }
}
