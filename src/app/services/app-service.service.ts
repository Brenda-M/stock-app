import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/ApiResponse.interface';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppEnums } from '../models/AppEnums';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    skey: 'my-auth-token',
    Accept: 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AppService {
  // API url

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {}



  makePostRequest(fullUrl: string, data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(fullUrl, data, httpOptions);
  }

  makeGetRequest(fullUrl: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(fullUrl, httpOptions);
  }

  public showToastMessage(
    alertType: AppEnums,
    alertTitle: string,
    alertMessage: string
  ) {
    switch (alertType) {
      case AppEnums.ToastTypeSuccess:
        return this.toastr.success(alertMessage, alertTitle);
        break;
      case AppEnums.ToastTypeInfo:
        return this.toastr.info(alertMessage, alertTitle);
        break;
      case AppEnums.ToastTypeWarning:
        return this.toastr.warning(alertMessage, alertTitle);
        break;
      case AppEnums.ToastTypeError:
        return this.toastr.error(alertMessage, alertTitle);
        break;
    }
  }

  showLoader() {
    this.ngxService.start();
  }

  stopLoader() {
    this.ngxService.stop();
  }

  makeLoginRequest(fullUrl: string, data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(fullUrl, data, httpOptions);
  }
}
