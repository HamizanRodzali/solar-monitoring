import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Device {
  name: string;
  macAddress: string;
}
@Injectable()
export class DeviceService {
  baseURL: string = "http://localhost:3000/";
  constructor(private http: HttpClient) { }

  getDevice(): Observable<Device[]> {
    console.log('getDevice ' + this.baseURL + 'device')
    return this.http.get<Device[]>(this.baseURL + 'device')
  }

  addDevice(device: Device): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(device);
    console.log(body)
    return this.http.post(this.baseURL + 'device', body, { 'headers': headers })
  }

}

