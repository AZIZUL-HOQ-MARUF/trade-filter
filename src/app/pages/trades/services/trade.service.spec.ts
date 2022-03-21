/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TradeService } from './trade.service';

describe('Service: Trade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TradeService]
    });
  });

  it('should ...', inject([TradeService], (service: TradeService) => {
    expect(service).toBeTruthy();
  }));
});
