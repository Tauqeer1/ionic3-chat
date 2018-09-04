import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GroupsProvider } from './../../providers/groups/groups';


@IonicPage()
@Component({
  selector: 'page-groupinfo',
  templateUrl: 'groupinfo.html',
})
export class GroupinfoPage {

  groupMembers = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private groupsProvider: GroupsProvider, private events: Events) {
  }

  ionViewDidLoad() {
    this.groupsProvider.getOwnership(this.groupsProvider.currentGroupName)
      .then((res) => {
        if (res) {
          this.groupMembers = this.groupsProvider.currentGroup;
        } else {
          this.groupsProvider.getGroupMembers();
        }
      });
    this.events.subscribe('gotMembers', () => {
      this.groupMembers = this.groupsProvider.currentGroup;
      console.log('groupMembers', this.groupMembers);
    });

  }

  ionViewWillLeave() {
    this.events.unsubscribe('gotMembers');
  }

  back() {
    this.navCtrl.pop();
  }

}
