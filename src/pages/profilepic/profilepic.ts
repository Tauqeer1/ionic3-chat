import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImagehandlerProvider } from '../../providers/imagehandler/imagehandler';


@IonicPage()
@Component({
  selector: 'page-profilepic',
  templateUrl: 'profilepic.html',
})
export class ProfilepicPage {
  photoUrl: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private imageHandlerProvider: ImagehandlerProvider) {
  }

  ionViewDidLoad() {

  }

  chooseImage() {
    this.imageHandlerProvider.uploadImage()
      .then(imageUrl => {
        this.photoUrl = imageUrl;
      }).catch(err => {

      })
  }


}
