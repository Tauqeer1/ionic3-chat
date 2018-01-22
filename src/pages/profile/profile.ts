import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  avatar: string;
  displayName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private zone: NgZone) {
  }

  ionViewWillEnter() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.userProvider.getUserDetails()
      .then((res: any) => {
        this.zone.run(() => {
          this.avatar = res.photoURL;
          this.displayName = res.displayName;
        });
      });
  }

  editImage() {

  }
  editName() {

  }
  logout() {

  }
}
