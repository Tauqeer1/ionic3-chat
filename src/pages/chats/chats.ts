import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  myRequests;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private requestProvider: RequestsProvider, private events: Events) {
  }

  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    this.requestProvider.getMyRequests();
    this.events.subscribe('gotRequests', () => {
      this.myRequests = [];
      this.myRequests = this.requestProvider.userDetails;
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotRequests');
  }
  addBuddy() {
    this.navCtrl.push('UsersPage');
  }

  accept(item) {
    console.log('item', item);
  }

  ignore(item) {
    console.log('item ignore', item);
  }

}
