import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from 'src/app/loader/loader.service';
import { NetworkServiceService } from 'src/app/services/network-service.service';
import { ToastaService } from 'src/app/toastr/toasta.service';
import { Api } from 'src/app/utils/app';

export interface FoodData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
  showMore?: boolean; // Property to manage the toggle state for description
}

@Component({
  selector: 'app-list-foods',
  templateUrl: './list-foods.component.html',
  styleUrls: ['./list-foods.component.css']
})
export class ListFoodsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name',  'price', 'stock', 'category', 'action'];
  dataSource: MatTableDataSource<FoodData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(
    private loadingService: LoaderService,
    private toastService: ToastaService,
    private networkService: NetworkServiceService,
  ) {
  
    const foods: FoodData[] = [ ];

    this.dataSource = new MatTableDataSource(foods);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.listFoods();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  listFoods = async () => {
    try {
      this.loadingService.isLoading.next(true);
  
      const response = await this.networkService.doGet(Api.foodUrl).toPromise();
      
      if (response) {
        this.dataSource = new MatTableDataSource(response as FoodData[]);
        this.toastService.showSuccess("Foods loaded successfully", "Success");
      } else {
        this.toastService.showError("Failed to load foods", "Error");
      }
    } catch (error) {
      console.error("Error loading foods:", error);
      this.toastService.showError("An error occurred while fetching the foods", "Error");
    } finally {
      this.loadingService.isLoading.next(false);
    }
  };
  
  deleteFood = async (id: string) => {
    try {
      const confirmDelete = confirm("Are you sure you want to delete this food item?");
      if (!confirmDelete) {
        return;
      }
        this.loadingService.isLoading.next(true);
  
      const response = await this.networkService.doDelete(`${Api.foodUrl}/${id}`).toPromise();
      
      if (response) {
        this.toastService.showSuccess("Food deleted successfully", "Success");
        this.listFoods();
      } else {
        this.toastService.showError("Failed to delete the food item", "Error");
      }
    } catch (error) {
      console.error("Error deleting food:", error);
      this.toastService.showError("An error occurred while deleting the food item", "Error");
    } finally {
      this.loadingService.isLoading.next(false);
    }
  };
  
}

