import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import { AddDevicePage } from '../add-device/add-device';
import { ViewDevicePage } from '../view-device/view-device';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  // data: Array<any>;
  data: any = []; 
  constructor(public navCtrl: NavController, 
              public deviceService: DeviceService) {

  }

  ionViewDidLoad() {
    // this.socket.connect();
    this.getDeviceList();
    
    // console.log('ionViewDidLoad');
  }

  getDeviceList() {
    this.deviceService.getDevice().subscribe((response) => {
			this.data = response
      console.log(this.data);
		});
  }

  getItems($event) {
    const term = $event.target.value.toUpperCase();
    console.log(term);
  }

  addDevice() {
    this.navCtrl.push(AddDevicePage);
  }

  viewDevice() {
    this.navCtrl.push(ViewDevicePage);
  }

}
