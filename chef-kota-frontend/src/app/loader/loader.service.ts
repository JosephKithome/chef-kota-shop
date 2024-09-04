import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading:  BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  constructor() { }
}
