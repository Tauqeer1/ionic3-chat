import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';
import { resolveDefinition } from '@angular/core/src/view/util';

@Injectable()
export class GroupsProvider {

  groups = firebase.database().ref('groups');
  myGroups = [];
  currentGroup: Array<any> = [];
  currentGroupName;
  groupPic;
  groupMessages = [];
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
          resolve(false);
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
    return new Promise((resolve, reject) => {
      this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
        .child('members').once('value', (snapshot) => {
          let tempMembers = snapshot.val();
          let tempUids = [];
          for (let key in tempMembers) {
            this.groups.child(tempMembers[key].uid).child(this.currentGroupName).remove();
          }

          this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
            .remove().then(() => {
              resolve(true);
            }).catch(err => {
              reject(err);
            })
        })
    });
  }

  leaveGroup() {
    return new Promise((resolve, reject) => {
      this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
        .once('value', (snapshot) => {
          let tempOwner = snapshot.val().owner;
          this.groups.child(tempOwner).child(this.currentGroupName).child('members')
            .orderByChild('uid').equalTo(firebase.auth().currentUser.uid)
            .once('value', (snapshot) => {
              snapshot.ref.remove().then(() => {
                this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName).remove()
                  .then(() => {
                    resolve(true);
                  }).catch(err => {
                    reject(err);
                  })
              }).catch(err => {
                reject(err);
              });
            });
        });
    });
  }

  getAllMessages(groupName) {

  }

  sendMessage(message) {
    return new Promise((resolve) => {
      this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('owner')
        .once('value', (snapshot) => {
          let tempOwner = snapshot.val();
          this.groups.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
            .child('msgBoard').push({
              sentBy: firebase.auth().currentUser.uid,
              displayName: firebase.auth().currentUser.displayName,
              photoURL: firebase.auth().currentUser.photoURL,
              message: message,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
              if (tempOwner !== firebase.auth().currentUser.uid) {
                this.groups.child(tempOwner).child(this.currentGroupName).child('msgBoard')
                  .push({
                    sentBy: firebase.auth().currentUser.uid,
                    displayName: firebase.auth().currentUser.displayName,
                    photoURL: firebase.auth().currentUser.photoURL,
                    message: message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                  })
              }
              let tempMembers = [];
              this.groups.child(tempOwner).child(this.currentGroupName).child('members')
                .once('value', (snapshot) => {
                  let tempMembersObj = snapshot.val();
                  for (let key in tempMembersObj) {
                    tempMembers.push(tempMembersObj[key]);
                  }
                }).then(() => {
                  let postedMessage = tempMembers.map((item) => {
                    if (item.uid !== firebase.auth().currentUser.uid) {
                      return new Promise((resolve) => {
                        this.postMessage(item, message, resolve);
                      })
                    }
                  })
                  Promise.all(postedMessage).then(() => {
                    this.getGroupMessages(this.currentGroupName);
                    resolve(true);
                  })
                })
            })
        })
    })
  }

  postMessage(member, message, cb) {
    this.groups.child(member.uid).child(this.currentGroupName).child('msgBoard')
      .push({
        sentBy: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName,
        photoURL: firebase.auth().currentUser.photoURL,
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        cb();
      })
  }

  getGroupMessages(groupName) {
    this.groups.child(firebase.auth().currentUser.uid).child(groupName).child('msgBoard')
      .on('value', (snapshot) => {
        let tempMessage = snapshot.val();
        this.groupMessages = [];
        for (let key in tempMessage) {
          this.groupMessages.push(tempMessage[key]);
        }
        this.events.publish('newGroupMessage');
      })
  }

}
