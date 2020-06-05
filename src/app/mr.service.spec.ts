import { TestBed } from '@angular/core/testing';

import { MRService } from './mr.service';

describe('MRService', () => {
  let service: MRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
