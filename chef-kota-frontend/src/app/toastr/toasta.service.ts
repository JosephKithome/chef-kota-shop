import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastaService {

  constructor(private toastr: ToastrService) { }

  showSuccess=(title: string, message: string) =>{
    this.toastr.success(title, message)
  }

  showError=(title: string, message: string) =>{
    this.toastr.error(title, message)
  }

showWarning=(title: string, message: string) =>{
  this.toastr.warning(title, message)
}
}
