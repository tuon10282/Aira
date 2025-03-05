import { TestBed } from '@angular/core/testing';

import { USerAPIService } from './user-api.service';

describe('USerAPIService', () => {
  let service: USerAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(USerAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
