import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/loader/loader.service';
import { Food, FoodModel } from 'src/app/models/food';
import { NetworkServiceService } from 'src/app/services/network-service.service';
import { ToastaService } from 'src/app/toastr/toasta.service';
import { Api } from 'src/app/utils/app';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css'],
})
export class AddFoodComponent implements AfterViewInit {
  food: FoodModel;
  categories: string[] = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  cancel() {
    throw new Error('Method not implemented.');
  }
  selectedCategory: any;

  constructor(
    private loadingService: LoaderService,
    private toastService: ToastaService,
    private router: Router,
    private networkService: NetworkServiceService
  ) {
    this.food = {} as FoodModel;
  }
  ngAfterViewInit(): void {}

  saveFood = async () => {
    // Start loading indicator
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
      } else {
        const response = await this.networkService
          .doPost(Api.foodUrl, this.food)
          .toPromise();
        console.log('Response:', response);

        this.toastService.showSuccess('Added new food', 'Success');
        this.router.navigate(['/app-home']);
      }
    } catch (error) {
      console.error('Error:', error);
      this.toastService.showError(
        (error as string) || 'Failed to add food item',
        'Error'
      );
    } finally {
      this.loadingService.isLoading.next(false);
    }
  };
}
