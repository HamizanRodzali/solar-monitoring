import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewDevicePage } from './view-device';

@NgModule({
  declarations: [
    ViewDevicePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewDevicePage),
  ],
})
export class ViewDevicePageModule {}
