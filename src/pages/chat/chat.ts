import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('content') content: Content;
  buddy: any;
  newMessage = '';
  allMessages = [];
  photoURL;
  constructor(public navCtrl: NavController, public navParams: NavParams, private chatProvider: ChatProvider, private events: Events) {
    this.buddy = this.chatProvider.buddy;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollTo();
    this.events.subscribe('newmessage', () => {
      this.allMessages = [];
      this.allMessages = this.chatProvider.buddyMessages;
      this.scrollTo();
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
    this.newMessage = this.newMessage.trim();
    if (this.newMessage === '') {
      return;
    }
    this.chatProvider.sendMessage(this.newMessage)
      .then(() => {
        this.content.scrollToBottom();
        this.newMessage = '';
      }).catch(err => {
        console.error('err', err);
      });
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }



}
