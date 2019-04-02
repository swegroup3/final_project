import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorregistrationComponent } from './vendorregistration.component';

describe('VendorregistrationComponent', () => {
  let component: VendorregistrationComponent;
  let fixture: ComponentFixture<VendorregistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorregistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
