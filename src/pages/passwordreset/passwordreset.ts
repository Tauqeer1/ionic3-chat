import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-passwordreset',
  templateUrl: 'passwordreset.html',
})
export class PasswordresetPage {

  email: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userProvider: UserProvider, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {

  }

  reset() {
    const alert = this.alertCtrl.create({
      buttons: ['Ok']
    });
    const loading = this.loadingCtrl.create({
      content: 'Please Wait'
    });
    const toaster = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    })
    if (this.email === '') {
      toaster.setMessage('Email field is required');
      toaster.present();
    } else {
      loading.present();
      this.userProvider.resetPassword(this.email)
        .then((res: any) => {
          loading.dismiss();
          if (res.success) {
            alert.setTitle('Email Sent');
            alert.setSubTitle('Please follow the instruction in the email to reset your password');
          }
          alert.present();
        }).catch(err => {
          toaster.setMessage(err.message);
          toaster.present();
          loading.dismiss();
        })
    }
  }
  goBack() {
    this.navCtrl.pop();
  }

}
