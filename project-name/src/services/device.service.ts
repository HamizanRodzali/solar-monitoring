import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from '../app/app.globals';

export interface Device {
  name: string;
  macAddress: string;
}
@Injectable()
export class DeviceService {
  token;

	constructor(private http: Http) {
	}

	private createAuthorizationHeader(headers: Headers) {
		headers.append('Accept-Language', 'en_US');
		headers.append('Content-Type', 'application/json');
	}

	create(device): Observable<Response> {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.post(Globals.BASE_API_URL + 'device', device, {
			headers: headers
		});
	}

	getAll(): Observable<Response> {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.get(Globals.BASE_API_URL + 'device', {
			headers: headers
		});
	}

	getOne(id): Observable<Response> {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.get(Globals.BASE_API_URL + 'device/' + id, {
			headers: headers
		});
	}

	delete(id): Observable<Response> {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.delete(Globals.BASE_API_URL + 'device/' + id, {
			headers: headers
		});
	}

}

