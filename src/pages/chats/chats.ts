import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  myRequests;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private requestProvider: RequestsProvider, private events: Events, private alertCtrl: AlertController) {
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

  acceptRequest(item) {
    console.log('item', item);
    this.requestProvider.acceptRequest(item).then(() => {
      let alert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him/her',
        buttons: ['Okay']
      });
      alert.present();
    })
  }

  declineRequest(item) {
    console.log('item  ignore', item);
    this.requestProvider.declineRequest(item).then(() => {

    });
  }

}
