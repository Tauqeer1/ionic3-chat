import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';

@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {

  owner: boolean = false;
  groupName;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private groupsProvider: GroupsProvider, private actionSheet: ActionSheetController) {
    this.groupName = this.navParams.get('groupName');
    this.groupsProvider.getOwnership(this.groupName)
      .then((res) => {
        if (res) {
          this.owner = true;
        }
      }).catch(err => {
        console.error('err', err);
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
            this.groupsProvider.deleteGroup();
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
            this.groupsProvider.leaveGroup();
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

}
