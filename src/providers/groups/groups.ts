import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';

@Injectable()
export class GroupsProvider {

  groups = firebase.database().ref('groups');
  myGroups = [];
  currentGroup: Array<any> = [];
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

  getIntoGroup(groupName) {
    console.log('groupName', groupName);
    if (groupName !== null) {
      this.groups.child(firebase.auth().currentUser.uid).child(groupName).once('value', (snapshot) => {
        if (snapshot.val() !== null) {
          let temp = snapshot.val().members;
          this.currentGroup = [];
          for (let key in temp) {
            this.currentGroup.push(temp[key]);
          }
          this.events.publish('gotIntoGroup');
        }
      });
    }
  }

  getOwnership(groupName) {
    return new Promise((resolve, reject) => {
      this.groups.child(firebase.auth().currentUser.uid).child(groupName).once('value', (snapshot) => {
        let temp = snapshot.val().owner;
        if (temp === firebase.auth().currentUser.uid) {
          resolve(true);
        } else {
          reject(false);
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  deleteGroup() {

  }

  leaveGroup() {

  }

}
