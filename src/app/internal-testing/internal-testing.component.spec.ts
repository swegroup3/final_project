import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalTestingComponent } from './internal-testing.component';

describe('InternalTestingComponent', () => {
  let component: InternalTestingComponent;
  let fixture: ComponentFixture<InternalTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
