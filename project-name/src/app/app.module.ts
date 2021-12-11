import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddDevicePage } from '../pages/add-device/add-device';
import { DeviceService } from '../services/device.service';
import { SocketService } from '../services/socket.service';
import { ViewDevicePage } from '../pages/view-device/view-device';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { ChartsModule } from 'ng2-charts';
// const config: SocketIoConfig = { url: 'http://localhost:3000/', options: {} };



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddDevicePage,
    ViewDevicePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    // SocketIoModule.forRoot(config),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddDevicePage,
    ViewDevicePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DeviceService,
    SocketService
  ]
})
export class AppModule {}
