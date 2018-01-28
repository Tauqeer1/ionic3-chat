import { Injectable } from '@angular/core';
import { Request } from '../../models/request.model';
import firebase from 'firebase';
@Injectable()
export class RequestsProvider {

  friends_request = firebase.database().ref('/friends_request');
  constructor() {

  }

  sendRequest(req: Request) {
    return new Promise((resolve, reject) => {
      this.friends_request.child(req.recipient).push({
        sender: req.sender
      }).then(() => {
        resolve({ success: true });
      })
    });
  }

}
