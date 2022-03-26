import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, debounceTime, interval, Observable, of, retry, Subject, switchMap, take, takeUntil } from 'rxjs';
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
  public $search: Subject<string> = new Subject();
  private $_timer: Observable<number> = interval(30000); // 30 seconds interval

  constructor(private _tradeService: TradeService) { }

  ngOnInit() {
    this._getAllData();
    this._registerSearchKeyUp();
    this._refreshData();
  }

  private _registerSearchKeyUp(): void {

    this.$search
    .pipe(
      takeUntil(this._unsubscribeAll),
      debounceTime(300)
    ).subscribe((search: string) => {

      if (!search) {
        this.nextChangeId = this.allDataList[0]?.next_change_id || '';
        return this.stashList = this.allDataList[0]?.stashes || [];
      }

      search = search.toLowerCase();
  
      this.stashList = [];
      this.allDataList.forEach(data => {

        this.stashList = [
          ...this.stashList,
          ...data.stashes.filter((stash: any) => {
            let character: string = (stash.lastCharacterName || '').toLowerCase();
            let matched: boolean = character.includes(search) || false;
            return this.selectedLeague ? this.selectedLeague && matched : matched;
          })
        ];

      });
    });

  }

  private _refreshData(): void {
    this.$_timer
    .pipe(
      takeUntil(this._unsubscribeAll),
      retry(3),
      switchMap( _=> {
        return this._getData(this.nextChangeId);
      })
    ).subscribe({
      next: (response) => {
        this._prepareTableData(response, true);
      },
      error: () => {
        this.nextChangeId = '';
        this.stashList = [];
        this.leagueList = [];
      },
    });
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
          return this._getData(this.allDataList[0].next_change_id );
        })
      ).subscribe({
        next: (response) => {
          this._prepareTableData(response);
        },
        error: () => {
          this.nextChangeId = '';
          this.stashList = [];
          this.leagueList = [];
        },
      });
  }

  private _getData(id: string): Observable<any> {
    return this._tradeService.getAllData({ id });
  }

  private _prepareTableData(response: any[], isRefresh: boolean = false): void {

    if (response.length == 0 && isRefresh) return;

    this.stashList = response[0].stashes

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
  }

  public onChangeFilter(): void {
    if (!this.selectedLeague) {
      this.nextChangeId = this.allDataList[0]?.next_change_id || '';
      return this.stashList = this.allDataList[0]?.stashes || [];
    }

    this.stashList = [];
    this.allDataList.forEach(data => {
      this.stashList = [...this.stashList, ...data.stashes.filter((stash: any) => stash.league == this.selectedLeague)];
    });
    
  }

  public onSearchKeyUp(event: any): void {
    this.$search.next((event.target as HTMLInputElement).value);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public trackBy(item: any) {
    return item?.id || null;
  }

}
