import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import { ToastService } from '../../services/toast.service';
import { AddDevicePage } from '../add-device/add-device';
import { ViewDevicePage } from '../view-device/view-device';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  devices;
  // data: Array<any>;
  data: any = []; 
  constructor(public navCtrl: NavController, 
              public deviceService: DeviceService,
              public toastService: ToastService,
              private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    this.getDeviceList();
  }

  getDeviceList() {
    this.deviceService.getAll().subscribe((response) => {
			this.data = response.json();
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

  deleteDevice(device) {
    const confirm = this.alertCtrl.create({
      title: `Delete ${device.name} ?`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.deviceService.delete(device._id).subscribe((response) => {
              console.log(response);
                this.toastService.toggleToast('Delete Success');
                this.getDeviceList();
            }, (err) => this.toastService.toggleToast(err.message));
          }
        },
        {
          text: 'Cancel',
          handler: () => {}
        }
      ]
    });
    confirm.present();
		
	}

  viewDevice(device) {
		this.navCtrl.push(ViewDevicePage, {
			device: device
		});
	}

}
