import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import firebase from 'firebase';

@Injectable()
export class ImagehandlerProvider {

  nativePath: any;
  firestore = firebase.storage();
  constructor(private fileChooser: FileChooser) {
  }

  uploadImage() {
    return new Promise((resolve, reject) => {
      this.fileChooser.open()
        .then(url => {
          (<any>window).FilePath.resolveNativePath(url, (result) => {
            this.nativePath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativePath, (res) => {
              res.file((resFile) => {
                let reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  let imageBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                  let imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
                  imageStore.put(imageBlob)
                    .then(res => {
                      this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL()
                        .then(url => {
                          resolve(url);
                        }).catch(err => {
                          reject(err);
                        })
                    }).catch(err => {
                      reject(err);
                    });
                }
              });
            });
          });
        });
    });
  }

  pictureMessage() {
    return new Promise((resolve, reject) => {
      this.fileChooser.open()
        .then(url => {
          (<any>window).FilePath.resolveNativePath(url, (result) => {
            this.nativePath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativePath, (res) => {
              res.file((resFile) => {
                let reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  let imageBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                  let imageStore = this.firestore.ref('/messagepics').child(firebase.auth().currentUser.uid).child('messagepics');
                  imageStore.put(imageBlob)
                    .then(res => {
                      this.firestore.ref('/messagepics').child(firebase.auth().currentUser.uid).child('messagepics').getDownloadURL()
                        .then(url => {
                          resolve(url);
                        }).catch(err => {
                          reject(err);
                        });
                    }).catch(err => {
                      reject(err);
                    });
                }
              });
            });
          });
        });
    });
  }

}
