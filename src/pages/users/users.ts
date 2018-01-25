import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  filteredUsers = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
    this.userProvider.getAllUsers().then((res: any) => {
      this.filteredUsers = res;
    });
  }

  ionViewDidLoad() {

  }

  sendRequest() {

  }

}
