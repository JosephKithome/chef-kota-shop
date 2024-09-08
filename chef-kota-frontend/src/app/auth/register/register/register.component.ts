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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: User;
  hidePassword = true; 

  constructor(
    private router: Router,
    private loadingService: LoaderService,
    private toastService: ToastaService,
    private networkService: NetworkServiceService
  ) {
    this.user = {} as UserModel;
  }

  register = () => {
    this.loadingService.isLoading.next(true);
  
    this.networkService
      .doPost(Api.register, this.user)
      .pipe(
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      )
      .subscribe((response) => {
        console.log("RESPONSE:::", response)
        this.loadingService.isLoading.next(false);
  
        if (response === "User already exists") {
          this.toastService.showError(response, 'Error');
        } else if (response) {
          this.toastService.showSuccess('Account created successfully', 'Success');
          this.router.navigate(['/login']);
        }
      });
  };
  
  private handleError(error: any): void {
    this.loadingService.isLoading.next(false);
    this.toastService.showError(`Error occurred during registration: ${error['error']}`, 'Error');
    console.error('Registration error:', error);
  }
  
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
