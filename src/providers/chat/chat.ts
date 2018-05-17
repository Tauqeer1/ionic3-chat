import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

@Injectable()
export class ChatProvider {

  chats = firebase.database().ref('/chats');
  buddy: any;
  buddyMessages = [];

  constructor(private events: Events) {

  }

  initializeChat(buddy) {
    this.buddy = buddy;
  }

  sendMessage(msg) {
    if (this.buddy) {
      return new Promise((resolve, reject) => {
        this.chats.child(firebase.auth().currentUser.uid).child(this.buddy.uid)
          .push({
            sentBy: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            this.chats.child(this.buddy.uid)
              .child(firebase.auth().currentUser.uid)
              .push({
                sentBy: firebase.auth().currentUser.uid,
                message: msg,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              }).then(() => {
                resolve(true);
              })
          });
      }).catch(err => {
        // reject(err);
      })
    }
  }

  getBuddyMessages() {
    let temp;
    this.chats.child(firebase.auth().currentUser.uid).child(this.buddy.uid)
      .on('value', (snapshot) => {
        this.buddyMessages = [];
        temp = snapshot.val();
        for (let tempKey in temp) {
          this.buddyMessages.push(temp[tempKey]);
        }
        this.events.publish('newmessage');
      });
  }
}
