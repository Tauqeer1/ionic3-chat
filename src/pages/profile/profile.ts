import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AuthProvider } from '../../providers/auth/auth';
import { ImagehandlerProvider } from '../../providers/imagehandler/imagehandler';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  avatar: string;
  displayName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userProvider: UserProvider, private zone: NgZone,
    private alertCtrl: AlertController, private authProvider: AuthProvider,
    private toastCtrl: ToastController, private loadingCtrl: LoadingController,
    private imageHandlerProvider: ImagehandlerProvider) {
  }

  ionViewWillEnter() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.userProvider.getUserDetails()
      .then((res: any) => {
        this.displayName = res.displayName;
        this.zone.run(() => {
          this.avatar = res.photoURL;
        });
      });
  }

  editImage() {
    const loader = this.loadingCtrl.create({
      content: 'Please Wait!'
    });
    const statusAlert = this.alertCtrl.create({
      buttons: ['Ok']
    });
    loader.present();
    this.imageHandlerProvider.uploadImage()
      .then((uploadedUrl: any) => {
        this.userProvider.updateImage(uploadedUrl)
          .then((res: any) => {
            loader.dismiss();
            if (res.success) {
              statusAlert.setTitle('Updated');
              statusAlert.setSubTitle('Your Profile picture has successfully updated');
              statusAlert.present();
              this.zone.run(() => {
                this.avatar = uploadedUrl;
              });
            } else {
              statusAlert.setTitle('Failed!');
              statusAlert.setSubTitle('Your Profile picture has not changed!');
              statusAlert.present();
            }
          });
      }).catch(err => {
        statusAlert.setTitle('Failed!');
        statusAlert.setSubTitle('Your Profile picture has not changed!');
        statusAlert.present();
      });
  }
  editName() {
    const loader = this.loadingCtrl.create({
      content: 'Please Wait'
    });
    const statusAlert = this.alertCtrl.create({
      buttons: ['Ok']
    });
    const alert = this.alertCtrl.create({
      title: 'Edit Name',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nick name'
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Edit',
          handler: data => {
            if (data.nickname) {
              loader.present();
              this.userProvider.updateDisplayName(data.nickname)
                .then((res: any) => {
                  loader.dismiss();
                  if (res.success) {
                    statusAlert.setTitle('Updated');
                    statusAlert.setSubTitle('Your Nickname has successfully updated');
                    statusAlert.present();
                    this.zone.run(() => {
                      this.displayName = data.nickname;
                    });
                  } else {
                    statusAlert.setTitle('Failed!');
                    statusAlert.setSubTitle('Your Nickname has not changed!');
                    statusAlert.present();
                  }
                });
            }
          }
        }]
    });
    alert.present();
  }
  logout() {
    const toaster = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });
    this.authProvider.logout()
      .then((res: any) => {
        if (res.success) {
          this.navCtrl.parent.parent.setRoot('LoginPage');
        }
      }).catch(err => {
        toaster.setMessage(err);
        toaster.present();
      });
  }
}
