import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  // Only use once for signup, so don't need to create interface
  newUser = {
    email: '',
    password: '',
    displayName: ''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userProvider: UserProvider, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {

  }

  signup() {
    const toaster = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });
    if (this.newUser.email === '' || this.newUser.password === '' || this.newUser.displayName === '') {
      toaster.setMessage('All fields are required');
      toaster.present();
    } else {
      const loader = this.loadingCtrl.create({
        content: 'Please wait'
      });
      loader.present();
      this.userProvider.createUser(this.newUser)
        .then((res: any) => {
          loader.dismiss();
          if (res.success) {
            this.navCtrl.push('ProfilepicPage')
          } else {
            console.error('err', res);
          }
        }).catch(err => {
          loader.dismiss();
          toaster.setMessage(err.message);
          toaster.present();
        })
    }
  }

  goBack() {
    this.navCtrl.pop();
  }



}
