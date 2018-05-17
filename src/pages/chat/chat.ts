import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  buddy: any;
  newMessage;
  allMessages = [];
  photoURL;
  constructor(public navCtrl: NavController, public navParams: NavParams, private chatProvider: ChatProvider, private events: Events) {
    this.buddy = this.chatProvider.buddy;
    this.photoURL = firebase.auth().currentUser.photoURL
    this.events.subscribe('newmessage', () => {
      this.allMessages = [];
      this.allMessages = this.chatProvider.buddyMessages;
    });
  }

  ionViewDidEnter() {
    this.chatProvider.getBuddyMessages();
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
      });
  }



}
