import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Content, Events } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {
  @ViewChild('content') content: Content;
  owner: boolean = false;
  groupName;
  newMessage;
  allGroupMessage = [];
  alignUid;
  photoURL;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private groupsProvider: GroupsProvider, private actionSheet: ActionSheetController,
    private events: Events) {
    this.alignUid = firebase.auth().currentUser.uid;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.groupName = this.navParams.get('groupName');
    this.groupsProvider.getOwnership(this.groupName)
      .then((res) => {
        if (res) {
          this.owner = true;
        } else {
          this.owner = false;
        }
      }).catch(err => {
        console.error('err', err);
      });
    this.groupsProvider.getAllMessages(this.groupName);
    this.events.subscribe('newGroupMessage', () => {
      this.allGroupMessage = [];
      this.allGroupMessage = this.groupsProvider.groupMessages;
      this.scrollTo();
    })
  }

  ionViewDidLoad() {
  }

  back() {
    this.navCtrl.pop();
  }

  presentOwnerSheet() {
    let sheet = this.actionSheet.create({
      title: 'Group Actions',
      buttons: [
        {
          text: 'Add Member',
          icon: 'person-add',
          handler: () => {
            this.navCtrl.push('GroupbuddiesPage');
          }
        },
        {
          text: 'Remove Member',
          icon: 'remove-circle',
          handler: () => {
            this.navCtrl.push('GroupmembersPage');
          }
        },
        {
          text: 'Group info',
          icon: 'person',
          handler: () => {
            this.navCtrl.push('GroupinfoPage', { groupName: this.groupName });
          }
        },
        {
          text: 'Delete Group',
          icon: 'trash',
          handler: () => {
            this.deleteGroup();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('cancelled');
          }
        }
      ]
    });
    sheet.present();
  }

  presentMembersSheet() {
    let sheet = this.actionSheet.create({
      title: 'Group Actions',
      buttons: [
        {
          text: 'Leave Group',
          icon: 'log-out',
          handler: () => {
            this.leaveGroup();
          }
        },
        {
          text: 'Group info',
          icon: 'person',
          handler: () => {
            this.navCtrl.push('GroupinfoPage', { groupName: this.groupName });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('cancelled');
          }
        }
      ]
    });
    sheet.present();
  }

  sendMessage() {
    this.groupsProvider.sendMessage(this.newMessage)
      .then(() => {
        this.scrollTo();
        this.newMessage = '';
      })
  }


  deleteGroup() {
    this.groupsProvider.deleteGroup()
      .then(() => {
        this.navCtrl.pop();
      }).catch(err => {
        console.error('err', err);
      });
  }

  leaveGroup() {
    this.groupsProvider.leaveGroup()
      .then(() => {
        this.navCtrl.pop();
      }).catch(err => {
        console.error('err', err);
      })
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }

}
