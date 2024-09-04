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
  usernameFormController = new FormControl('', Validators.required);
  passwordFormController = new FormControl('', Validators.required);
  user: User;

  constructor(
    private router: Router,
    private loadingService: LoaderService,
    private toastService: ToastaService,
    private networkService: NetworkServiceService
  ) {
    this.user = {} as UserModel;
  }

  register =() => {
    this.loadingService.isLoading.next(true);

    try {
      this.networkService
        .doPost(Api.register, this.user)
        .pipe(
          catchError((error) => {
            this.toastService.showError(
              'Error occurred during registration:',
              error
            );

            this.loadingService.isLoading.next(false);

            this.toastService.showError(
              'Registration failed. Please try again.',
              'Error'
            );
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response !=="User already exists") {
            console.log('RESPONSE:: ', response);
            this.loadingService.isLoading.next(false);
            this.toastService.showSuccess(
              'Account created successfully',
              'Success'
            );
            this.router.navigate(['/login']);
          }else{
            this.loadingService.isLoading.next(false);
            this.toastService.showSuccess(
             response,
              'Error'
            );
          }
        });
    } catch (error) {
      this.toastService.showError('Unexpected error:', error as string);
      this.loadingService.isLoading.next(false);
      this.toastService.showError(
        'Unexpected error occurred. Please try again.',
        'Error'
      );
    }
  }
}
