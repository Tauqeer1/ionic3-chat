import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Request } from '../../models/request.model';
import { UserProvider } from '../user/user';
import firebase from 'firebase';
@Injectable()
export class RequestsProvider {

  friends_request = firebase.database().ref('/friends_request');
  firends = firebase.database().ref('/friends');
  userDetails;
  myFriends;
  constructor(private userProvider: UserProvider, private events: Events) {

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

  getMyRequests() {
    let allRequests;
    let myRequests = [];
    this.friends_request.child(firebase.auth().currentUser.uid)
      .once('value', (snapshot) => {
        allRequests = snapshot.val();
        myRequests = [];
        for (let i in allRequests) {
          myRequests.push(allRequests[i].sender);
        }
      });
    this.userProvider.getAllUsers()
      .then((res: any) => {
        let allUsers = res;
        this.userDetails = [];
        for (let j in myRequests) {
          for (let k in allUsers) {
            if (myRequests[j] === allUsers[k].uid) {
              this.userDetails.push(allUsers[k]);
            }
          }
        }
        this.events.publish('gotRequests');
      });
  }

  acceptRequest(item) {
    return new Promise((resolve, reject) => {
      this.firends.child(firebase.auth().currentUser.uid).push({
        uid: item.uid
      }).then(() => {
        this.firends.child(item.uid).push({
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.declineRequest(item).then(() => {
            resolve({ success: true })
          }).catch((err) => {
            reject(err);
          })
        })
      });
    });
  }

  declineRequest(item) {
    return new Promise((resolve, reject) => {
      this.friends_request.child(firebase.auth().currentUser.uid).orderByChild('sender')
        .equalTo(item.uid).once('value', (snapshot) => {
          let tempStore = snapshot.val();
          let someKey = Object.keys(tempStore);
          this.firends.child(firebase.auth().currentUser.uid).child(someKey[0])
            .remove().then(() => {
              resolve({ success: true });
            }).catch((err) => {
              reject(err);
            }).catch((err) => {
              reject(err);
            });
        });
    });
  }

  getMyFriends() {
    let friendsUid = [];
    this.firends.child(firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        let allFriends = snapshot.val();
        for (var i in allFriends) {
          friendsUid.push(allFriends[i].uid);
        }

        this.userProvider.getAllUsers()
          .then(users => {
            this.myFriends = [];
            for (let j in friendsUid) {
              for (let key in users) {
                if (friendsUid[j] === users[key].uid) {
                  this.myFriends.push(users[key]);
                }
              }
            }
            this.events.publish('friends');
          }).catch(err => {
            console.error('err', err);
          });
      });
  }
}
