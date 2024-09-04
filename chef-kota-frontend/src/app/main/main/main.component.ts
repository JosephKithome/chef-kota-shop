import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {
  inventoryItems: [] = [];
  totalOrders: number = 750;
  servedCustomers: number = 320;
  pendingOrders: number = 50;
  totalCash: number = 47220
  constructor(){
    
  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    
  }

  // Load inventory items from service
  loadInventory(): void {
    // this.inventoryService.getInventoryItems().subscribe(
    //   (items) => {
    //     this.inventoryItems = items;
    //   },
    //   (error) => {
    //     console.error('Failed to load inventory:', error);
    //   }
    // );
  }

  // Load order statistics
  loadOrderStats(): void {
    // this.inventoryService.getOrderStats().subscribe(
    //   (stats) => {
    //     this.totalOrders = stats.totalOrders;
    //     this.servedCustomers = stats.servedCustomers;
    //     this.pendingOrders = stats.pendingOrders;
    //   },
    //   (error) => {
    //     console.error('Failed to load order statistics:', error);
    //   }
    // );
  }

  // Calculate stock percentage for the progress bar
  getStockPercentage(stock: number): number {
    const maxStock = 100; // Assume 100 is the max stock level for visualization
    return (stock / maxStock) * 100;
  }

  

}
