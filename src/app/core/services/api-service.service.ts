import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  API_URL = environment.api_url;

  constructor(private http: HttpClient) { }

  public get(url: string, paramsData?: any): Observable<any> {
    let params = this.getHttpParams(paramsData);
    return this.http.get(this.API_URL + url, { params });
  }

  public post(url: string, data: any, paramsData?: any): Observable<any> {
    let params = this.getHttpParams(paramsData);
    return this.http.post(this.API_URL + url, data, { params });
  }

  public put(url: string, data: any, paramsData?: any): Observable<any> {
    let params = this.getHttpParams(paramsData);
    return this.http.put(this.API_URL + url, data, { params });
  }

  public patch(url: string, data: any, paramsData?: any): Observable<any> {
    let params = this.getHttpParams(paramsData);
    return this.http.patch(this.API_URL + url, data, { params });
  }

  public delete(url: string, paramsData?: any): Observable<any> {
    let params = this.getHttpParams(paramsData);
    return this.http.delete(this.API_URL + url, { params });
  }

  private getHttpParams(paramsData?: any): HttpParams {

    let httpParams = new HttpParams();
    if (paramsData !== undefined) {
      Object.getOwnPropertyNames(paramsData).forEach(key => {
        httpParams = httpParams.set(key, paramsData[key]);
      });
    }

    return httpParams;
  }

}
