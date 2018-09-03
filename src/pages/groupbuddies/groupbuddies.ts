import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { GroupsProvider } from './../../providers/groups/groups';
@IonicPage()
@Component({
  selector: 'page-groupbuddies',
  templateUrl: 'groupbuddies.html',
})
export class GroupbuddiesPage {
  myFriends = [];
  groupMembers = [];
  tempMyFriends = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private requestProvider: RequestsProvider, private events: Events,
    private groupsProvider: GroupsProvider) {
  }

  ionViewWillEnter() {
    this.requestProvider.getMyFriends();
    this.events.subscribe('friends', () => {
      this.myFriends = [];
      this.myFriends = this.requestProvider.myFriends;
      this.groupMembers = this.groupsProvider.currentGroup;
      for (let key in this.groupMembers) {
        for (let friend in this.myFriends) {
          if (this.groupMembers[key].uid === this.myFriends[friend].uid) {
            this.myFriends.splice(this.myFriends.indexOf(this.myFriends[friend]), 1);
          }
        }
      }
      this.tempMyFriends = this.myFriends;
    });

  }
  ionViewDidLoad() {

  }

  searchBuddy(e) {
    this.myFriends = this.tempMyFriends;
    let q = e.target.value;
    console.log('q', q);
    if (!q || q.trim() === '') {
      return;
    }
    this.myFriends = this.myFriends.filter((v) => {
      // console.log('v', v);
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });
  }

  back() {
    this.navCtrl.pop();
  }

  addBuddy(key) {

  }


}
