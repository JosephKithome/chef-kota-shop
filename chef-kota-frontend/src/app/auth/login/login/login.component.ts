import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { User, UserModel } from 'src/app/models/User';
import { LoaderService } from 'src/app/loader/loader.service';
import { ToastaService } from 'src/app/toastr/toasta.service';
import { NetworkServiceService } from 'src/app/services/network-service.service';
import { Api } from 'src/app/utils/app';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usernameFormController = new FormControl('', Validators.required);
  passwordFormController = new FormControl('', Validators.required);
  user: User;

  constructor(
    private router: Router,
     private loadingService: LoaderService,
     private toastService: ToastaService,
     private networkService: NetworkServiceService,
    ){
    this.user = {} as UserModel;
  }


  public signIn(): void {
    this.loadingService.isLoading.next(true);
  
    try {const usr = new User()
      usr.email = this.user.email
      usr.username = this.user.username
      usr.password = this.user.password
      if (usr.username==null ||  usr.username==undefined) {
        this.toastService.showError('Username cannot be empty','Error',);
        this.loadingService.isLoading.next(false);
      }
      else if (usr.password==null ||  usr.password==undefined) {
        this.toastService.showError('Password cannot be empty','Error',);
        this.loadingService.isLoading.next(false);
      }else{
          
      this.networkService.doLogin(Api.loginUrl, this.user)
      .pipe(
        catchError((error) => {
         
          this.loadingService.isLoading.next(false);
          this.toastService.showError('Failed to sign in. Please try again.', 'Error');
          return of(null); 
        })
      )
      .subscribe((response) => {
        if (response && response.token) {
          this.loadingService.isLoading.next(false);
          this.toastService.showSuccess('Successfully signed in', 'Success');
          this.router.navigate(['/app-home']);
        } else {
          this.loadingService.isLoading.next(false);
          this.toastService.showError( 'Invalid response received. Token is missing.', 'Error');
        }
      });
        
      }

    } catch (error) {
      this.loadingService.isLoading.next(false);
      this.toastService.showError(error as string || 'Unexpected error occurred. Please try again.', 'Error');
    }
  }

  navigate = ()=>{
    this.router.navigate(['/signUp']);
  }

}
