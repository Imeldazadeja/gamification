import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm, NgModel} from "@angular/forms";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  currentPwHide = true;
  newPwHide = true;
  confirmPwHide = true;
  newPassword!: string;
  confirmPassword?:string;
  matchPassword = false;
  exist: string = '';

  @Input('mustPwMatch') mustPwMatch: string[] = [];
  @ViewChild('newPasswordControl', {read: FormControl}) newPasswordControl!: FormControl;
  @ViewChild('expiredPassword') expiredPassword!: NgForm;
  // Min. 8 chars, 1 between !$%&?@#, 1 num and 1 capital letter
  passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\S)(?=.*[!$%&?@#])([\S!$%&?@#]{8,})$/;

  constructor() { }

  ngOnInit(): void {
  }

  onPasswordChange(form: NgForm): void {
    if (form.value.newPassword !== form.value.confirmPassword) {
      this.expiredPassword.controls['confirmPassword'].setErrors({notEqual: true});
    }
  }

  getPasswordError(passwordModel: NgModel): string {
    if (passwordModel.errors?.notEqual) {
      return 'Passwords must match'
    } else {
      return '';
    }
  }

}
