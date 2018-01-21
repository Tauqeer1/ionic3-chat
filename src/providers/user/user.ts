import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

@Injectable()
export class UserProvider {

  chatUsers = firebase.database().ref('/chatusers');
  constructor(private afAuth: AngularFireAuth) {

  }

  createUser(newUser) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(() => {
          this.afAuth.auth.currentUser.updateProfile({
            displayName: newUser.displayName,
            photoURL: ''
          }).then(() => {
            this.chatUsers.child(this.afAuth.auth.currentUser.uid)
              .set({
                uid: this.afAuth.auth.currentUser.uid,
                displayName: this.afAuth.auth.currentUser.displayName, // newUser.displayName
                photoURL: ''
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
}
