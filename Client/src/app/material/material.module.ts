import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';


const MaterialComponents = [
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
  MatSidenavModule,
  FormsModule,
  ReactiveFormsModule,
  MatSelectModule,
  MatDialogModule,
  MatBottomSheetModule,
  MatCardModule,
  MatTableModule,
  MatGridListModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatProgressBarModule
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})

export class MaterialModule { }

export class CustomValidators {

// Validates that child controls in the form group are equal
  static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
      const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {});
      const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value);
      return isValid ? null : { childrenNotEqual: true };
  }
}


// Custom ErrorStateMatcher which returns true (error exists) when the parent form group is invalid and the control has been touched
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return control.parent.invalid && control.touched;
  }
}


// Collection of reusable RegExps
export const regExps: { [key: string]: RegExp } = {
  identityCard: /^\d{9}$/,
  email: /^\w+[\w-\.]*\@([\w-]+\.)+[\w-]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
};


// Collection of reusable error messages
export const errorMessages: { [key: string]: string } = {
  identityCard: 'ID must be 9 numbers.',
  email: 'Email must be a valid email address (username@domain)',
  password: 'Password must be minimum eight characters, at least one letter and one number.',
  confirmPassword: 'Passwords must match'
};