import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
// import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { Globals } from '../app/app.globals';

@Injectable()
export class SocketService {
    private socket;
    constructor() {
        this.socket = io(Globals.BASE_API_URL, {
			// 'query': 'token=' + Globals.API_AUTH_TOKEN
		});
    }

    getData() {
        let observable = new Observable(observer => {
            this.socket.on('temp', (data) => {
                observer.next(data);
            });

            return (error) => {
                console.error(error);
                this.socket.disconnect();
            };
        })
        return observable;
    }

    getDataV2(macAddress) {
        let observable = new Observable(observer => {
            this.socket.on('data:save:' + macAddress , (data) => {
                observer.next(data);
            });

            return (error) => {
                console.error(error);
                this.socket.disconnect();
            };
        })
        return observable;
    }
}
