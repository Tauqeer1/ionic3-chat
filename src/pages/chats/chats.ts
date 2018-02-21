import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  myRequests;
  myFriends;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private requestProvider: RequestsProvider, private events: Events, private alertCtrl: AlertController,
    private chatProvider: ChatProvider) {
  }

  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    this.requestProvider.getMyRequests();
    this.requestProvider.getMyFriends();
    this.events.subscribe('gotRequests', () => {
      this.myRequests = [];
      this.myRequests = this.requestProvider.userDetails;
    });

    this.events.subscribe('friends', () => {
      this.myFriends = [];
      this.myFriends = this.requestProvider.myFriends;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotRequests');
    this.events.unsubscribe('friends');
  }
  addBuddy() {
    this.navCtrl.push('UsersPage');
  }

  acceptRequest(item) {
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
    this.requestProvider.declineRequest(item).then(() => {
    });
  }

  buddyChat(buddy) {
    this.chatProvider.initializeChat(buddy);
    this.navCtrl.push('ChatPage');
  }

}
