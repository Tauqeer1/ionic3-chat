import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user.model';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider) {


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
    this.authProvider.login(this.user)
      .then((res: any) => {
        if (!res.code) {
          this.navCtrl.setRoot('TabsPage');
        } else {
          alert(res);
        }
      })
  }

}
