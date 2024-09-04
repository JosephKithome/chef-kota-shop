import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoaderService } from 'src/app/loader/loader.service';
import { Food, FoodModel } from 'src/app/models/food';
import { NetworkServiceService } from 'src/app/services/network-service.service';
import { ToastaService } from 'src/app/toastr/toasta.service';
import { Api } from 'src/app/utils/app';




@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.css']
})
export class EditFoodComponent implements OnInit {
  food: FoodModel;
  categories: string[] = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  cancel() {
    throw new Error('Method not implemented.');
  }
  selectedCategory: any;
  id: string 


  constructor(
    private loadingService: LoaderService,
    private toastService: ToastaService,
    private router: Router,
    private networkService: NetworkServiceService,
    private route: ActivatedRoute
  ) {
    this.food = {} as FoodModel;
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.id = params['id'];
     

      setTimeout(() => { this.getFoodById(this.id); }, 1000);
     
    });
  }
  getFoodById(id: string) {
    this.loadingService.isLoading.next(true);
  
    this.networkService.doGet(`${Api.foodUrl}/${id}`).subscribe(
      (response) => {
   
        this.toastService.showSuccess("Retrieved Item", "Success");
        
        this.food = response as FoodModel;
      },
      (error) => {
        this.toastService.showError("Failed to retrieve item", "Error");
      },
      () => {
       
        this.loadingService.isLoading.next(false);
      }
    );
  }
  
 

  updateFood = async () => {
    this.loadingService.isLoading.next(true);
  
    try {
      const fd = new Food();
      fd.name = this.food.name;
      fd.description = this.food.description;
      fd.category = this.food.category;
      fd.price = this.food.price;
      fd.stock = this.food.stock;
      fd.imageUrl = this.food.imageUrl;
      if (fd.name == null || fd.name == undefined) {
        this.toastService.showError('Enter food name', 'Error');
      }
      if (fd.description == null || fd.description == undefined) {
        this.toastService.showError('Enter food desc', 'Error');
      }
      if (fd.category == null || fd.category == undefined) {
        this.toastService.showError('Select a category', 'Error');
      }
      if (fd.price == null || fd.price == undefined) {
        this.toastService.showError('Enter price', 'Error');
      }
      if (fd.imageUrl == null || fd.imageUrl == undefined) {
        this.toastService.showError('upload an image', 'Error');
      }
      if (fd.stock == null || fd.stock == undefined) {
        this.toastService.showError('Input stock', 'Error');
      }else{
      const response = await this.networkService
        .doPut(`${Api.foodUrl}/${this.id}`, this.food)
        .toPromise();
  
      console.log("Response:", response);
      this.toastService.showSuccess("Food updated successfully", "Success");
  
      this.food = {} as FoodModel;
  
      this.router.navigate(['/app-home']);
    }
    } catch (error) {
      console.error("Error:", error);
      this.toastService.showError(
        error as string || "Failed to update food item",
        "Error"
      );
    } finally {
      this.loadingService.isLoading.next(false);
    }
}
}
