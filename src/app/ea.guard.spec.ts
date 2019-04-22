import { TestBed, async, inject } from '@angular/core/testing';

import { EAGuard } from './ea.guard';

describe('EAGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EAGuard]
    });
  });

  it('should ...', inject([EAGuard], (guard: EAGuard) => {
    expect(guard).toBeTruthy();
  }));
});
