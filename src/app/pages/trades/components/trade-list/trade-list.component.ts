import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, of, Subject, switchMap, take } from 'rxjs';
import { TradeService } from '../../services/trade.service';

@Component({
  selector: 'app-trade-list',
  templateUrl: './trade-list.component.html',
  styleUrls: ['./trade-list.component.css']
})
export class TradeListComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject();
  private nextChangeId: string = '';
  public stashList: any[] = [];

  constructor(private _tradeService: TradeService) { }

  ngOnInit() {
    this._getAllData();
  }

  private _getAllData(): void {
    this._tradeService.getAllData()
      .pipe(
        take(1),
        catchError(error => {
          return of([{ next_change_id: '' }])
        }),
        switchMap((response) => {
          let data = response[0];
          return this._tradeService.getAllData({ id: data.next_change_id });
        })
      ).subscribe(response => {
        this.stashList = response[0].stashes;
        this.nextChangeId = response[0].next_change_id;
      })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public trackBy(item: any) {
    return item?.id || null;
  }

}
