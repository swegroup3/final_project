import { TestBed, async, inject } from '@angular/core/testing';

import { EvaGuard } from './eva.guard';

describe('EvaGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaGuard]
    });
  });

  it('should ...', inject([EvaGuard], (guard: EvaGuard) => {
    expect(guard).toBeTruthy();
  }));
});
