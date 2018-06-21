import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { config } from './app.firebase.config';

import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { ImagehandlerProvider } from '../providers/imagehandler/imagehandler';
import { RequestsProvider } from '../providers/requests/requests';
import { ChatProvider } from '../providers/chat/chat';
import { GroupsProvider } from '../providers/groups/groups';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'top' }),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FilePath,
    FileChooser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    UserProvider,
    ImagehandlerProvider,
    RequestsProvider,
    ChatProvider,
    GroupsProvider
  ]
})
export class AppModule { }
