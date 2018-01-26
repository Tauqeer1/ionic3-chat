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
  tempArr = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
    this.userProvider.getAllUsers().then((res: any) => {
      this.filteredUsers = res;
      this.tempArr = res;
    });
  }

  ionViewDidLoad() {

  }

  sendRequest() {
    console.log('working');
  }

  searchUser(e) {
    this.filteredUsers = this.tempArr;
    let q = e.target.value;
    console.log('q', q);
    if (!q || q.trim() === '') {
      return;
    }
    this.filteredUsers = this.filteredUsers.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });
  }
}
