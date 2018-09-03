import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {

  allMyGroups: Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private events: Events, private loadingCtrl: LoadingController,
    private groupsProvider: GroupsProvider) {
  }

  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Getting your groups, please wait...'
    });
    loader.present();
    this.groupsProvider.getMyGroups();
    this.events.subscribe('newgroup', () => {
      loader.dismiss();
      this.allMyGroups = this.groupsProvider.myGroups;
    })
  }
  ionViewDidLeave() {
    this.events.unsubscribe('newgroup');
  }

  addGroup() {
    this.navCtrl.push('NewgroupPage');
  }

  openChat(group) {
    this.groupsProvider.getIntoGroup(group.groupName);
    this.navCtrl.push('GroupchatPage', { groupName: group.groupName });
  }

}
