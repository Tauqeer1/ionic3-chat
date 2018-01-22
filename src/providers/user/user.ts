import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

@Injectable()
export class UserProvider {

  users = firebase.database().ref('/users');
  constructor(private afAuth: AngularFireAuth) {

  }

  createUser(newUser) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(() => {
          this.afAuth.auth.currentUser.updateProfile({
            displayName: newUser.displayName,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/fir-chat-6c7cd.appspot.com/o/avatar.jpg?alt=media&token=3d1af62f-dc83-4c77-b269-2fddbe409310'
          }).then(() => {
            this.users.child(this.afAuth.auth.currentUser.uid)
              .set({
                uid: this.afAuth.auth.currentUser.uid,
                displayName: this.afAuth.auth.currentUser.displayName, // newUser.displayName
                photoURL: 'https://firebasestorage.googleapis.com/v0/b/fir-chat-6c7cd.appspot.com/o/avatar.jpg?alt=media&token=3d1af62f-dc83-4c77-b269-2fddbe409310'
              }).then(() => {
                resolve({ success: true });
              }).catch(err => {
                reject(err);
              });
          }).catch(err => {
            reject(err);
          });
        }).catch(err => {
          console.error('err', err);
          reject(err);
        });
    });
  }

  resetPassword(email) {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          resolve({ success: true });
        }).catch(err => {
          reject(err);
        });
    });
  }

  updateImage(imageUrl) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.currentUser.updateProfile({
        displayName: this.afAuth.auth.currentUser.displayName,
        photoURL: imageUrl
      }).then(() => {
        firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`)
          .update({
            displayName: this.afAuth.auth.currentUser.displayName,
            photoURL: imageUrl,
            uid: firebase.auth().currentUser.uid
          }).then(() => {
            resolve({ success: true });
          }).catch(err => {
            reject(err);
          });
      }).catch(err => {
        reject(err);
      });
    });
  }
  getUserDetails() {
    return new Promise((resolve, reject) => {
      this.users.child(firebase.auth().currentUser.uid)
        .once('value', (snapshot) => {
          resolve(snapshot.val());
        }).catch(err => {
          reject(err);
        });
    });
  }
}
