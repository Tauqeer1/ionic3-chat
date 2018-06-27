import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';

@Injectable()
export class GroupsProvider {

  groups = firebase.database().ref('groups');
  myGroups = [];
  constructor(private events: Events) {
  }

  createGroup(newGroup) {
    console.log('newGroup', newGroup);
    return new Promise((resolve, reject) => {
      this.groups.child(firebase.auth().currentUser.uid).child(newGroup.groupName).set({
        groupPic: newGroup.groupPic,
        msgBoard: '',
        owner: firebase.auth().currentUser.uid
      }).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      })
    });
  }

  getMyGroups() {
    this.groups.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      this.myGroups = [];
      if (snapshot.val() !== null) {
        let temp = snapshot.val();
        for (let key in temp) {
          this.myGroups.push({
            groupName: key,
            groupPic: temp[key].groupPic
          });
        }
      }
      this.events.publish('newgroup');
    })
  }

}
