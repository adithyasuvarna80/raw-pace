import { TestBed } from '@angular/core/testing';

import { Scouting } from './scouting';

describe('Scouting', () => {
  let service: Scouting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Scouting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
