import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Globals } from '../app/app.globals';

@Injectable()
export class DataService {
	token;
	dataLimit = 100;

	constructor(private http: Http) {
	}

	private createAuthorizationHeader(headers: Headers) {
		headers.append('Accept-Language', 'en_US');
		headers.append('Content-Type', 'application/json');
	}

	create(data): Observable<Response> {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.post(Globals.BASE_API_URL + 'data', data, {
			headers: headers
		});
	}

	get(id): Observable<Response> {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.get(Globals.BASE_API_URL + 'data/' + id + '/' + this.dataLimit, {
			headers: headers
		});
	}

}
