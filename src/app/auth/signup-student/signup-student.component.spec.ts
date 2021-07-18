import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupStudentComponent } from './signup-student.component';

describe('SignupUsersComponent', () => {
  let component: SignupStudentComponent;
  let fixture: ComponentFixture<SignupStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
