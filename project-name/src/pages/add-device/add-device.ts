import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage {
  device = {
		name: '',
		macAddress: ''
	}


  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public deviceService: DeviceService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDevicePage');
  }

  create() {
    this.deviceService.addDevice(this.device)
      .subscribe(data => {
        console.log(data)
        this.navCtrl.setRoot(HomePage);
      })      
  }

}
