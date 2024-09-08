import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login/login.component';
import { MainComponent } from './main/main/main.component';
import { NewUserComponent } from './users/new/new-user/new-user.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { AddFoodComponent } from './food/new/add-food/add-food.component';
import { ListFoodsComponent } from './food/new/list-foods/list-foods.component';
import { EditFoodComponent } from './food/view/edit-food/edit-food.component';
import { RegisterComponent } from './auth/register/register/register.component';

const routes: Routes = [
  {path: 'app-home', component: MainComponent},
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  {path: 'users', component: UsersListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signUp', component: RegisterComponent},
  {path: 'add-food', component:  AddFoodComponent },
  {path: 'food', component:  ListFoodsComponent },
  {path: 'edit-food/:id', component: EditFoodComponent},

  //  users
  {path: 'new-user', component: NewUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
