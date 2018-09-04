import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';

@Injectable()
export class GroupsProvider {

  groups = firebase.database().ref('groups');
  myGroups = [];
  currentGroup: Array<any> = [];
  currentGroupName;
  groupPic;
  constructor(private events: Events) {
  }

  createGroup(newGroup) {
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
    if (groupName !== null) {
      this.groups.child(firebase.auth().currentUser.uid).child(groupName).once('value', (snapshot) => {
        if (snapshot.val() !== null) {
          let temp = snapshot.val().members;
          this.currentGroup = [];
          for (let key in temp) {
            this.currentGroup.push(temp[key]);
          }
          this.currentGroupName = groupName;
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

  getGroupImage() {
    return new Promise((resolve, reject) => {
      this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
        .once('value', (snapshot) => {
          this.groupPic = snapshot.val().groupPic;
          resolve(true);
        });
    });
  }

  getGroupMembers() {
    this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
      .once('value', (snapshot) => {
        let tempData = snapshot.val().owner;
        this.groups.child(tempData).child(this.currentGroupName).child('members')
          .once('value', (snapshot) => {
            let temp = snapshot.val();
            for (let key in temp) {
              this.currentGroup.push(temp[key]);
            }
          });
      });
    this.events.publish('gotMembers');
  }

  addMember(newMember) {
    this.groups.child(firebase.auth().currentUser.uid)
      .child(this.currentGroupName)
      .child('members').push(newMember)
      .then(() => {
        this.getGroupImage().then(() => {
          this.groups.child(newMember.uid).child(this.currentGroupName)
            .set({
              groupPic: this.groupPic,
              owner: firebase.auth().currentUser.uid,
              msgBoard: ''
            }).catch((err) => {
              console.error('err', err);
            });
        });
        this.getIntoGroup(this.currentGroupName);
      });
  }

  deleteMember(member) {
    console.log('member', member);
    this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
      .child('members').orderByChild('uid').equalTo(member.uid)
      .once('value', (snapshot) => {
        snapshot.ref.remove().then(() => {
          this.groups.child(member.uid).child(this.currentGroupName).remove()
            .then(() => {
              this.getIntoGroup(this.currentGroupName);
            });
        });
      });
  }

  deleteGroup() {

  }

  leaveGroup() {

  }

}
