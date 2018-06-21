import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class GroupsProvider {

  groups = firebase.database().ref('groups');

  constructor() {
  }

  createGroup(newGroup) {
    return new Promise((resolve, reject) => {
      this.groups.child(firebase.auth().currentUser.uid).child(newGroup.groupName).set({
        groupImage: newGroup.groupImage,
        msgBoard: '',
        owner: firebase.auth().currentUser.uid
      }).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      })
    });

  }

}
