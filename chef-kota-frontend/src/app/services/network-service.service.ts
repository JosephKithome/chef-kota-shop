import { HttpClient, HttpHeaders, HttpParams, HttpHandler, HttpEvent, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, finalize } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LoaderService } from 'src/app/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkServiceService implements HttpInterceptor {

  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient, private loaderService: LoaderService) { }

  /**
   * Intercepts HTTP requests to show a loader during request execution.
   * @param request - The HTTP request.
   * @param next - The HTTP handler.
   * @returns Observable of HTTP events.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true);
    return next.handle(request).pipe(
      finalize(() => this.loaderService.isLoading.next(false))
    );
  }

  /**
   * Log in and save the token to local storage.
   * @param url - The endpoint URL for login.
   * @param data - The login data (e.g., email and password).
   * @returns Observable with the API response.
   */
  doLogin(url: string, data: any): Observable<any> {
   
    return this.http.post<any>(`${this.apiUrl}${url}`, data).pipe(
      tap((response: { token: string }) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  /**
   * Make a GET request to the specified URL with optional parameters and Bearer token.
   * @param url - The endpoint URL.
   * @param params - Optional query parameters.
   * @returns Observable with the API response.
   */
  doGet<T>(url: string, params?: { [key: string]: any }): Observable<T> {
    this.loaderService.isLoading.next(true);
    let httpParams = new HttpParams();
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }
    const headers = this.createHeaders();
    return this.http.get<T>(`${this.apiUrl}${url}`, { params: httpParams, headers }).pipe(
      finalize(() => this.loaderService.isLoading.next(false))
    );
  }

  /**
   * Make a POST request to the specified URL with the given data and optional Bearer token.
   * @param url - The endpoint URL.
   * @param data - The data to send in the body of the request.
   * @returns Observable with the API response.
   */
  doPost<T>(url: string, data: any): Observable<T> {
    this.loaderService.isLoading.next(true);
    const headers = this.createHeaders();
    return this.http.post<T>(`${this.apiUrl}${url}`, data, { headers }).pipe(
      finalize(() => this.loaderService.isLoading.next(false))
    );
  }

  /**
   * Make a PUT request to the specified URL with the given data and optional Bearer token.
   * @param url - The endpoint URL.
   * @param data - The data to send in the body of the request.
   * @returns Observable with the API response.
   */
  doPut<T>(url: string, data: any): Observable<T> {
    this.loaderService.isLoading.next(true);
    const headers = this.createHeaders();
    return this.http.put<T>(`${this.apiUrl}${url}`, data, { headers }).pipe(
      finalize(() => this.loaderService.isLoading.next(false))
    );
  }

  /**
   * Make a DELETE request to the specified URL with optional Bearer token.
   * @param url - The endpoint URL.
   * @returns Observable with the API response.
   */
  doDelete<T>(url: string): Observable<T> {
    this.loaderService.isLoading.next(true);
    const headers = this.createHeaders();
    return this.http.delete<T>(`${this.apiUrl}${url}`, { headers }).pipe(
      finalize(() => this.loaderService.isLoading.next(false))
    );
  }

  /**
   * Create headers with optional Bearer token.
   * @returns HttpHeaders object.
   */
  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
