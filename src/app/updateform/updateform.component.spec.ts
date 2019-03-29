import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateformComponent } from './updateform.component';

describe('UpdateformComponent', () => {
  let component: UpdateformComponent;
  let fixture: ComponentFixture<UpdateformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
