import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable()
export class TradeService {

  constructor(private apiService: ApiService) { }

  public getAllData(params?: any): Observable<any> {
    return this.apiService.get('public-stash-tabs', params);
  }

}
