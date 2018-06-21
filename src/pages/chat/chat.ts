import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ImagehandlerProvider } from './../../providers/imagehandler/imagehandler';
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
  imageOrNot;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private chatProvider: ChatProvider, private events: Events,
    private loadingCtrl: LoadingController, private imageHandlerProvider: ImagehandlerProvider) {
    this.buddy = this.chatProvider.buddy;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollTo();
    this.events.subscribe('newmessage', () => {
      this.allMessages = [];
      this.imageOrNot = [];
      this.allMessages = this.chatProvider.buddyMessages;
      for (let key in this.allMessages) {
        if (this.allMessages[key].message.substring(0, 4) == 'http') {
          this.imageOrNot.push(true);
        } else {
          this.imageOrNot.push(false);
        }
      }
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

  sendPicMessage() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait!'
    });
    loader.present();
    this.imageHandlerProvider.pictureMessage()
      .then(imgUrl => {
        loader.dismiss();
        this.chatProvider.sendMessage(imgUrl)
          .then(() => {
            this.content.scrollToBottom();
            this.newMessage = '';
          }).catch((err) => {
            console.error('err', err);
            loader.dismiss();
          })
      });
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 10);
  }



}
