import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockTickerComponent } from './components/stock-ticker/stock-ticker.component';
import { StockTickerService } from './services/stock-ticker.service';

@NgModule({
  declarations: [
    AppComponent,
    StockTickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,    
    FormsModule,    
    HttpClientModule,  
  ],
  providers: [StockTickerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
