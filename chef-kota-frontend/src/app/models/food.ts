export interface FoodModel {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
  }
  
  export class Food implements FoodModel {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
  
  }
  