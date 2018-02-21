import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  buddy: any;
  newMessage;
  buddyMessage = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private chatProvider: ChatProvider) {
    this.buddy = this.chatProvider.buddy;
  }

  ionViewDidLoad() {
  }

  back() {
    this.navCtrl.pop();
  }

  sendMessage() {
    this.chatProvider.sendMessage(this.newMessage)
      .then(() => {
        this.newMessage = '';
      }).catch(err => {
        console.error('err', err);
      })l;
  }

  gotBuddyMessages() {
    this.buddyMessage = [];
    this.chats.child(firebase.auth().currentUser.uiid);
  }


}
