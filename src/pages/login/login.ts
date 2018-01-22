import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../models/user.model';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authProvider: AuthProvider, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {


  }

  ionViewDidLoad() {

  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  passwordReset() {
    this.navCtrl.push('PasswordresetPage');
  }

  login() {
    const toaster = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });
    const loader = this.loadingCtrl.create({
      content: 'Please Wait!'
    });
    loader.present();
    this.authProvider.login(this.user)
      .then((res: any) => {
        loader.dismiss();
        if (!res.code) {
          this.navCtrl.setRoot('TabsPage');
        } else {
          toaster.setMessage(res.code);
          toaster.present();
        }
      }).catch(err => {
        loader.dismiss();
        toaster.setMessage(err.message);
        toaster.present();
      })
  }

}
