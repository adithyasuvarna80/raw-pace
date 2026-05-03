import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BowlerDetail } from './bowler-detail';

describe('BowlerDetail', () => {
  let component: BowlerDetail;
  let fixture: ComponentFixture<BowlerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BowlerDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(BowlerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
