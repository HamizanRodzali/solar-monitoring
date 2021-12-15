import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import { ToastService } from '../../services/toast.service';
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
              public deviceService: DeviceService,
              public toastCtrl: ToastService) {
  }

  ionViewDidLoad() {}

  create() {
    this.deviceService.create(this.device)
      .subscribe(data => {
        console.log(data)
        this.toastCtrl.showToast('data added');
        this.navCtrl.setRoot(HomePage);
      }, (err) => this.toastCtrl.showToast(err.message));      
  }

}
