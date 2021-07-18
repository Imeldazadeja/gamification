import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupLecturerComponent } from './signup-lecturer.component';

describe('SignupLecturerComponent', () => {
  let component: SignupLecturerComponent;
  let fixture: ComponentFixture<SignupLecturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupLecturerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupLecturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
