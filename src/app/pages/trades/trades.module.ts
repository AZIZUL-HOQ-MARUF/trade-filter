import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeService } from './services/trade.service';
import { TradeListComponent } from './components/trade-list/trade-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'list'
  },
  {
    path: 'list', component: TradeListComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TradeListComponent],
  providers: [TradeService]
})
export class TradesModule { }
