import { Injectable } from '@angular/core';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Observable, throwError, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators'; 
import { environment } from 'src/environments/environment';
import { Stock } from '../models/stock'; 
import * as signalR from '@microsoft/signalr';  

@Injectable({
  providedIn: 'root'
})
export class StockTickerService {  
private url = environment.baseUrl + '/stocks';  
private connection: signalR.HubConnection;
  
constructor(private http: HttpClient) { 
  this.createConnection();
}  


private createConnection() {
  this.connection = new signalR.HubConnectionBuilder() 
    .withUrl(this.url)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)  
    .build();
}
start(): Promise<any> {
  return this.connection.start();
}

getAllStocks(): Promise<Stock[]> {
  return this.connection.invoke("GetAllStocks");
}  

getMarketState(): Promise<any> {  
  return this.connection.invoke("GetMarketState");
}  

openMarket(): Promise<any> {  
  return this.connection.invoke("OpenMarket");
}   

closeMarket(): Promise<any> {  
  return this.connection.invoke("CloseMarket");
}   

reset(): Promise<any> {  
  return this.connection.invoke("Reset");
}  

streamStocks(): signalR.IStreamResult<any> {  
  return this.connection.stream("StreamStocks");
}   

marketOpened(callback: any){
  this.connection.on("marketOpened", callback);
}

marketClosed(callback: any){
  this.connection.on("marketClosed", callback);
}
}
