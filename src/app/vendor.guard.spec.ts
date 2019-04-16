import { TestBed, async, inject } from '@angular/core/testing';

import { VendorGuard } from './vendor.guard';

describe('VendorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorGuard]
    });
  });

  it('should ...', inject([VendorGuard], (guard: VendorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
