import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';


@IonicPage()
@Component({
  selector: 'page-groupmembers',
  templateUrl: 'groupmembers.html',
})
export class GroupmembersPage {

  groupMembers = [];
  tempMembers = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private groupsProvider: GroupsProvider, private events: Events) {
  }

  ionViewWillEnter() {
    this.groupMembers = this.groupsProvider.currentGroup;
    this.tempMembers = this.groupsProvider.currentGroup;
    this.events.subscribe('gotIntoGroup', () => {
      this.groupMembers = this.groupsProvider.currentGroup;
      this.tempMembers = this.groupsProvider.currentGroup;
    });
  }

  ionViewWillLeave() {
    this.events.unsubscribe('gotIntoGroup');
  }

  back() {
    this.navCtrl.pop();
  }

  searchMember(e) {
    this.groupMembers = this.tempMembers;
    let q = e.target.value;
    if (!q || q.trim() === '') {
      return;
    }
    this.groupMembers = this.groupMembers.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });
  }

  removeMember(member) {
    this.groupsProvider.deleteMember(member);
  }

}
