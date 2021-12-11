import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocketService } from '../../services/socket.service';

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

  temp: any = 0;
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
      text: 'Solar Volt & Current, LM35, Humidity, Temp, Light vs Time'
    }
  };

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public lineChartData: Array<any> = [{
    label: 'Solar V',
    data: [16, 16, 18, 18.9, 19, 18.1, 17.7],
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Solar C',
    data: [65, 59, 80, 81, 56, 55, 40].reverse(),
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'TempLM35',
    data: [30, 32, 36, 38, 35, 32, 39],
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Light',
    data: [2, , 1, 7, 10, 10, 6],
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Temp',
    data: [30, 32, 36, 38, 35, 32, 39].reverse(),
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Humidity',
    data: [50, 60, 60, 70, 70, 80, 74],
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }
  
];
  public lineChartLabels: Array<any> = [1, 2, 3, 4, 5, 6, 7];
  // public labels: Array<any> = ;

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
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
    public socket: SocketService) {

  }

  ionViewDidLoad() {
    this.socketInit();
  }

  socketInit() {
    this.socket.getData().subscribe((data) => {
      this.temp = data;
      // this.lineChartData.push(data);
      // console.log(data);
    });
  }

}
