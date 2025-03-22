import { TestBed } from '@angular/core/testing';

import { FeedbackAPIService } from './feedback-api.service';

describe('FeedbackAPIService', () => {
  let service: FeedbackAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
