import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { ImagehandlerProvider } from './../../providers/imagehandler/imagehandler';

@IonicPage()
@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html',
})
export class NewgroupPage {

  newGroup = {
    groupName: 'New Group',
    groupPic: 'https://firebasestorage.googleapis.com/v0/b/fir-chat-6c7cd.appspot.com/o/avatar.jpg?alt=media&token=3d1af62f-dc83-4c77-b269-2fddbe409310'
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private groupProvider: GroupsProvider, private imageHandlerProvider: ImagehandlerProvider) {
  }

  ionViewDidLoad() {
  }

  createGroup() {
    this.groupProvider.
  }
  editGroupName() {
    const loader = this.loadingCtrl.create({
      content: 'Please Wait'
    });
    const alert = this.alertCtrl.create({
      title: 'Edit Group Name',
      inputs: [{
        name: 'groupname',
        placeholder: 'Give a new groupname'
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Set',
          handler: data => {
            if (data.groupname) {
              loader.present();
              this.newGroup.groupName = data.groupname;
            } else {
              this.newGroup.groupName = 'New Group';
            }
          }
        }]
    });
    alert.present();
  }
  chooseGroupImage() {
    const loader = this.loadingCtrl.create({
      content: 'Please Wait!'
    });
    loader.present();
    if (this.newGroup.groupName === 'New Group') {
      let alert = this.alertCtrl.create({
        buttons: ['ok'],
        message: 'Please enter the group name first. Thanks'
      });
      alert.present();
    } else {
      this.imageHandlerProvider.uploadGroupImage(this.newGroup.groupName)
        .then((res: any) => {
          loader.dismiss();
          if (res) {
            this.newGroup.groupPic = res;
          }
        }).catch(err => {
          loader.dismiss();
          console.error('err', err);
        });
    }
  }
  back() {
    this.navCtrl.pop();
  }

}
