import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../app/models/user.model';
@Injectable()
export class AuthProvider {

  constructor(private afAuth: AngularFireAuth) {
  }

  login(credentials: User) {
    // later change to async await
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(() => {
          resolve(true);
        }).catch(err => {
          reject(err);
        });
    });
  }
}
