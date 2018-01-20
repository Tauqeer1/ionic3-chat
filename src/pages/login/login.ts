import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user.model';
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
    console.log('ionViewDidLoad LoginPage');
  }

  passwordReset() {

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
  signup() {

  }

}
