import { Component, OnInit } from '@angular/core';
import { StockTickerService } from 'src/app/services/stock-ticker.service';

@Component({
  selector: 'app-stock-ticker',
  templateUrl: './stock-ticker.component.html',
  styleUrls: ['./stock-ticker.component.scss']
})
export class StockTickerComponent implements OnInit {

  private tickerInterval: any;
  pos = 30;
  constructor(private stockTickerService: StockTickerService) { }

  async ngOnInit(): Promise<any> {
    this.loadStocks();
  }

  async loadStocks() {
    await this.stockTickerService.start();
    
    // get all stocks
    const stocks = await this.stockTickerService.getAllStocks();
    // display all stocks
    console.log("All stocks: ", stocks);

    // get market state
    const marketState = await this.stockTickerService.getMarketState();
  if (marketState === 'Open') {
      this.onMarketOpened();
    } else {
        this.marketClosed();
    }

    // keep listening to marketOpened event and marketClosed event
    this.stockTickerService.marketOpened(this.onMarketOpened);
    this.stockTickerService.marketClosed(this.marketClosed)
  }


  startStreaming() {
    this.stockTickerService.streamStocks().subscribe({
        closed: false,
        next: this.displayStock,
        complete: this.complete,
        error: err =>
            console.log(err)
    });
  }

  marketOpened() {
    this.tickerInterval = setInterval(this.moveTicker, 20);
    // document.getElementById('open').setAttribute("disabled", "disabled");
    // document.getElementById('close').removeAttribute("disabled");
    // document.getElementById('reset').setAttribute("disabled", "disabled");
  }

  onMarketOpened(){    
    this.marketOpened();
    this.startStreaming();
  }

  moveTicker() {
    this.pos--;
    if (this.pos < -600) {
        this.pos = 500;
    }
    // stockTickerBody.style.marginLeft = pos + 'px';
  }

  marketClosed() {
      if (this.tickerInterval) {
          clearInterval(this.tickerInterval);
      }
      // document.getElementById('open').removeAttribute("disabled");
      // document.getElementById('close').setAttribute("disabled", "disabled");
      // document.getElementById('reset').removeAttribute("disabled");
  }

  displayStock(stock: any) {
      var displayStock = this.formatStock(stock);
      // addOrReplaceStock(stockTableBody, displayStock, 'tr', rowTemplate);
      // addOrReplaceStock(stockTickerBody, displayStock, 'li', tickerTemplate);
  }

  complete() {      
      // addOrReplaceStock(stockTableBody, displayStock, 'tr', rowTemplate);
      // addOrReplaceStock(stockTickerBody, displayStock, 'li', tickerTemplate);
  }

  formatStock(stock: any) {
      stock.price = stock.price.toFixed(2);
      stock.percentChange = (stock.percentChange * 100).toFixed(2) + '%';
      // stock.direction = stock.change === 0 ? '' : stock.change >= 0 ? up : down;
      // stock.directionClass = stock.change === 0 ? 'even' : stock.change >= 0 ? 'up' : 'down';
      return stock;
  }

  addOrReplaceStock(table: any, stock: any, type: any, template: any) {
      var child = this.createStockNode(stock, type, template);
  
      // try to replace
      var stockNode = document.querySelector(type + "[data-symbol=" + stock.symbol + "]");
      if (stockNode) {
          var change: any = stockNode.querySelector(".changeValue");
          var prevChange = parseFloat(change.childNodes[1].data);
          if (prevChange > stock.change) {
              child.className = "decrease";
          }
          else if (prevChange < stock.change) {
              child.className = "increase";
          }
          else {
              return;
          }
          table.replaceChild(child, stockNode);
      } else {
          // add new stock
          table.appendChild(child);
      }
  }

  createStockNode(stock: any, type: any, template: any) {
      var child = document.createElement(type);
      child.setAttribute('data-symbol', stock.symbol);
      child.setAttribute('class', stock.symbol);
      child.innerHTML = template.supplant(stock);
      return child;
  }

}
