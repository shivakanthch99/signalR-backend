import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  foodchanged$ = new Subject();
  messageReceived$ = new Subject<any>();
  newCpuValue$ = new Subject<number>();
  connectionEstablished$ = new BehaviorSubject<boolean>(false);

  private hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  sendChatMessage(message: any) {
    this.hubConnection.invoke('SendMessage', message);
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.baseUrl + '/stocks')
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  private startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Hub connection started!');
        this.connectionEstablished$.next(true);
      },
      error => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('FoodAdded', (data: any) => {
      this.foodchanged$.next(data);
    });

    this.hubConnection.on('FoodDeleted', (data: any) => {
      this.foodchanged$.next('this could be data');
    });

    this.hubConnection.on('FoodUpdated', (data: any) => {
      this.foodchanged$.next('this could be data');
    });

    this.hubConnection.on('Send', (data: any) => {
      console.log('data', data);
      this.messageReceived$.next(data);
    });

    this.hubConnection.on('newCpuValue', (data: number) => {
      this.newCpuValue$.next(data);
    });
  }
}
