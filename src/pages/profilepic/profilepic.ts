import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ImagehandlerProvider } from '../../providers/imagehandler/imagehandler';
import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-profilepic',
  templateUrl: 'profilepic.html',
})
export class ProfilepicPage {
  imgUrl = 'https://firebasestorage.googleapis.com/v0/b/fir-chat-6c7cd.appspot.com/o/avatar.jpg?alt=media&token=3d1af62f-dc83-4c77-b269-2fddbe409310';
  moveon = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private imageHandlerProvider: ImagehandlerProvider, private zone: NgZone,
    private userProvider: UserProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

  }

  chooseImage() {
    const loader = this.loadingCtrl.create({
      content: 'Please Wait!'
    });
    loader.present();
    this.imageHandlerProvider.uploadImage()
      .then((uploadedUrl: any) => {
        loader.dismiss();
        this.zone.run(() => {
          this.imgUrl = uploadedUrl;
          this.moveon = false;
        })
      }).catch(err => {

      });
  }

  proceed() {
    this.navCtrl.setRoot('TabsPage');
  }

  updateProceed() {
    const loader = this.loadingCtrl.create({
      content: 'Please Wait!'
    });
    loader.present();
    this.userProvider.updateImage(this.imgUrl)
      .then((res: any) => {
        loader.dismiss();
        if (res.success) {
          this.navCtrl.setRoot('TabsPage');
        } else {
          console.log('res', res);
        }
      });
  }

}
