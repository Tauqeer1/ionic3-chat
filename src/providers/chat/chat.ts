import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ChatProvider {

  chats = firebase.database().ref('/chats');
  buddy: any;

  constructor() {

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
            timestamp: firebase.database.ServerValue.TIMESTAMP;
          }).then(() => {
            this.chats.child(this.buddy.uid)
              .child(firebase.auth().currentUser.uid)
              .push({
                sentBy: firebase.auth().currentUser.uid;
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
}
