import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

  addDevice(device: Device): Observable<HttpResponse<any>> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(device);
    console.log(body)
    return this.http.post<any>(this.baseURL + 'device', body, { 'headers': headers })
  }

  delete(id): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.delete<any>(this.baseURL + 'device/' + id, { 'headers': headers });
  }

}

