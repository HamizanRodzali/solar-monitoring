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
  searchTerm: any = "";
  data: any = [];
  filterData: any = [];
  constructor(public navCtrl: NavController,
    public deviceService: DeviceService,
    public toastService: ToastService,
    private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    this.getDeviceList();
  }

  doRefresh(refresher) {
    this.getDeviceList();
    if (refresher) {
      refresher.complete();
    }
  }

  getDeviceList() {
    this.deviceService.getAll().subscribe((response) => {
      this.data = response.json();
      this.filterData = this.data;
      console.log(this.data);
    });
  }

  setFilteredItems() {
    this.filterData = this.data.filter((device) => {
      return device.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    })

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
          handler: () => { }
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
