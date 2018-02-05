import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Request } from '../../models/request.model';
import { RequestsProvider } from '../../providers/requests/requests';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  filteredUsers = [];
  tempArr = [];
  newRequest = {} as Request;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userProvider: UserProvider, private alertCtrl: AlertController,
    private requestsProvider: RequestsProvider) {
    this.userProvider.getAllUsers().then((res: any) => {
      this.filteredUsers = res;
      this.tempArr = res;
    });
  }

  ionViewDidLoad() {

  }

  back() {
    this.navCtrl.pop();
  }
  sendRequest(recipient) {
    console.log('recipient', recipient);
    this.newRequest.sender = firebase.auth().currentUser.uid;
    this.newRequest.recipient = recipient.uid;
    console.log('this.newRequest', this.newRequest);
    if (this.newRequest.sender === this.newRequest.recipient) {
      console.log('You are already friend');
    } else {
      let successAlert = this.alertCtrl.create({
        title: 'Request sent',
        subTitle: `Your request sent to ${recipient.displayName}`,
        buttons: ['Ok']
      });
      this.requestsProvider.sendRequest(this.newRequest)
        .then((res: any) => {
          if (res.success) {
            successAlert.present();
            let sentUser = this.filteredUsers.indexOf(recipient);
            console.log('sentUser', sentUser);
            this.filteredUsers.splice(sentUser, 1);
          }
        }).catch(err => {
          console.error('err', err);
        })
    }
  }

  searchUser(e) {
    this.filteredUsers = this.tempArr;
    let q = e.target.value;
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
