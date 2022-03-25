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
  public allDataList: any[] = [];
  public leagueList: any[] = [];
  public selectedLeague: string = '';

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
          this.allDataList = response;
          if (response.length == 0) return of(null);
          return this._tradeService.getAllData({ id: this.allDataList[0].next_change_id });
        })
      ).subscribe({
        next: (response) => {

          this.stashList = response ? response[0].stashes : [];

          this.leagueList = this.stashList
            .filter(stash => stash.league)
            .map(stash => stash.league);

          this.leagueList = [...new Set(this.leagueList)].map((league, index) => {
            return ({
              id: index,
              name: league
            });
          });

          this.nextChangeId = response ? response[0].next_change_id : '';
        },
        error: () => {
          this.nextChangeId = '';
          this.stashList = [];
          this.leagueList = [];
        },
      });
  }

  public onChangeFilter(): void {
    if (!this.selectedLeague) {
      this.nextChangeId = this.allDataList[0]?.next_change_id || '';
      return this.stashList = this.allDataList[0]?.stashes || [];
    }

    this.stashList = [];
    this.allDataList.forEach(data => {
      console.log(data.stashes.filter((stash: any) => stash.league == this.selectedLeague));
      
      this.stashList = [...this.stashList, ...data.stashes.filter((stash: any) => stash.league == this.selectedLeague)];
    });
    
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public trackBy(item: any) {
    return item?.id || null;
  }

}
