import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { DeviceService } from '../../services/device.service';
import { SocketService } from '../../services/socket.service';
import { ToastService } from '../../services/toast.service';

/**
 * Generated class for the ViewDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-device',
  templateUrl: 'view-device.html',
})
export class ViewDevicePage {


  public device: any;
  public data: Array<any>;
  public toggleState: boolean = false;
  private subData: any;
  public lastRecord: any;
  isData: boolean = false;
  pvalue: any = "day";

  // temp: any = 0;
  // Line Chart
  public lineChartOptions: any = {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    hover: {
      mode: 'label'
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            steps: 10,
            stepValue: 5,
            max: 100
          }
        }
      ]
    },
    title: {
      display: true,
      text: 'PV Temperature, Humidity, Temp, Light'
    }
  };

  public lineChartOptions2: any = {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    hover: {
      mode: 'label'
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            steps: 10,
            stepValue: 5,
            max: 100
          }
        }
      ]
    },
    title: {
      display: true,
      text: 'Solar Volt, Current & Watt'
    }
  };

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public lineChartType2: string = 'line';

  // Graph 1
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];

  // Graph 2
  public lineChartData2: Array<any> = [];
  public lineChartLabels2: Array<any> = [];
  // public labels: Array<any> = ;

  public lineChartColors: Array<any> = [
    { 
      borderColor: '#e84351',
      backgroundColor: '#e84351' 
    },
    { 
      borderColor: '#434a54',
      backgroundColor: '#434a54' 
    },
    { 
      borderColor: '#3ebf9b',
      backgroundColor: '#3ebf9b' 
    },
    {
      borderColor: '#4d86dc',
      backgroundColor: '#4d86dc'
    }, 
  ];

  public lineChartColors2: Array<any> = [
    {
      borderColor: '#4d86dc',
      backgroundColor: '#4d86dc'
    }, 
    {
      borderColor: '#f3af37',
      backgroundColor: '#f3af37'
    },
    { 
      borderColor: '#3ebf9b',
      backgroundColor: '#3ebf9b' 
    }
  ];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public socket: SocketService,
    private dataService: DataService,
    private deviceService: DeviceService,
    private toastService: ToastService) {

    this.device = navParams.get("device");

  }

  ionViewDidLoad() {
    this.deviceService.getOne(this.device._id).subscribe((response) => {
      this.device = response.json();
      this.getData();
      this.socketInit();
    });
    console.log(this.pvalue);
    // this.socketInit();
  }

  getData() {
    this.dataService.get(this.device.macAddress).subscribe((response) => {
      this.data = response.json();
      this.genChart();
      this.lastRecord = this.data[0]; // descending order data
      if (this.lastRecord) {
        this.toggleState = this.lastRecord.data.l;
      }
    });
  }


  socketInit() {
    this.subData = this.socket.getDataV2(this.device.macAddress).subscribe((data) => {
      if (this.data.length <= 0) return;
      this.data.splice(this.data.length - 1, 1); // remove the last record
      this.data.push(data); // add the new one
      this.lastRecord = data;
    }, (err) => console.error(err));
  }

  ionViewDidUnload() {
    this.subData ? this.subData.unsubscribe() : '';
  }

  genChart() {
    let data = this.data;
    let _dtArr: Array<any> = [];
    let _lblArr: Array<any> = [];

    let _dtArr2: Array<any> = [];
    let _lblArr2: Array<any> = [];

    let lm35: Array<any> = [];
    let light: Array<any> = [];
    let volt: Array<any> = [];
    let amp: Array<any> = [];
    let watt: Array<any> = [];
    let tmpArr: Array<any> = [];
    let humArr: Array<any> = [];

    for (var i = 0; i < data.length; i++) {
      let _d = data[i];
      lm35.push(_d.data.LM35);
      light.push(_d.data.light);
      volt.push(_d.data.voltage);
      amp.push(_d.data.current);
      watt.push(_d.data.watt);
      tmpArr.push(_d.data.temp);
      humArr.push(_d.data.humd);
      _lblArr.push(this.formatDate(_d.createdAt));
    }
    // reverse data to show the latest on the right side
    lm35.reverse();
    light.reverse();
    volt.reverse();
    amp.reverse();
    watt.reverse();
    tmpArr.reverse();
    humArr.reverse();
    _lblArr.reverse();
    _dtArr = [
      {
        data: lm35,
        label: 'PV Temperature',
        fill: false,
        // borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        data: light,
        label: 'Light',
        fill: false,
        // borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      // {
      //   data: volt,
      //   label: 'Voltage',
      //   fill: false,
      //   // borderColor: 'rgb(75, 192, 192)',
      //   tension: 0.1
      // },
      // {
      //   data: amp,
      //   label: 'Current',
      //   fill: false,
      //   // borderColor: 'rgb(75, 192, 192)',
      //   tension: 0.1
      // },
      // {
      //   data: watt,
      //   label: 'Watt',
      //   fill: false,
      //   // borderColor: 'rgb(75, 192, 192)',
      //   tension: 0.1
      // },
      {
        data: tmpArr,
        label: 'Temperature',
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        data: humArr,
        label: 'Humidity',
        fill: false,
        borderColor: 'rgb(85, 165, 192)',
        tension: 0.1
      }
    ];

    _dtArr2 = [
      {
        data: volt,
        label: 'Voltage',
        fill: false,
        // borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        data: amp,
        label: 'Current',
        fill: false,
        // borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        data: watt,
        label: 'Watt',
        fill: false,
        // borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]

    // this.lineChartData = _dtArr.slice(0, 10);
    // this.lineChartLabels = _lblArr.slice(0, 10);
    this.lineChartData = _dtArr;
    this.lineChartLabels = _lblArr;

    this.lineChartData2 = _dtArr2;
    this.lineChartLabels2 = _lblArr;
    this.isData = true;
  }

  getLatest() {

    this.getData();
    this.genChart();
    this.toastService.toggleToast('Graph updated');

  }

  private formatDate(originalTime) {
    var d = new Date(originalTime);
    var datestring =
      d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
    return datestring;
  }

  getValue() {
    console.log(this.pvalue);
    // the value will be displayed
  }

}
