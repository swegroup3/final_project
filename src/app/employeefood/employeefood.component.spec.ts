import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeefoodComponent } from './employeefood.component';

describe('EmployeefoodComponent', () => {
  let component: EmployeefoodComponent;
  let fixture: ComponentFixture<EmployeefoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeefoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeefoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
