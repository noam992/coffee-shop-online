import { ConfirmValidParentMatcher, errorMessages, regExps, CustomValidators } from './../../../material/material.module';
import { UserModel } from './../../../models/user-model';
import { AuthenticationService } from '../../../services/authentication.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharingDataRegisterService } from 'src/app/services/sharing-data/sharing-data-register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  public user = new UserModel;
  public userRegistrationForm: FormGroup;
  public confirmValidParentMatcher = new ConfirmValidParentMatcher();
  public errors = errorMessages;
  public hide = true;
  public secondHide = true;
  public isUserError: string = null;
  public errorIsUserContainer

  constructor(private formBuilder: FormBuilder,
              private myAuthenticationService: AuthenticationService,
              private myRouter: Router,
              private mySharingDataRegister: SharingDataRegisterService) 
    {this.createForm();}

  // Validation for first step register
  createForm() {
      this.userRegistrationForm = this.formBuilder.group({
          identityCard: ['', [
              Validators.required,
              Validators.pattern(regExps.identityCard)
          ]],
          email: ['', [
            Validators.required,
            Validators.pattern(regExps.email)
          ]],
          passwordGroup: this.formBuilder.group({
              password: ['', [
                  Validators.required,
                  Validators.pattern(regExps.password)
              ]],
              confirmPassword: ['', Validators.required]
          }, { validator: CustomValidators.childrenEqual})
      });
  }

  // Check and move to next register step
  public async moveToNextRegisterStep() {

    try {
     
      // Check is user exist
      const isUser = await this.myAuthenticationService.firstStepOfRegister(this.user);
      
      // If user is exist, show to user error
      if (isUser.isUser) {
        this.isUserError = "User is already existed in the system";
        this.errorIsUserContainer = {display: 'auto', color: 'red', margin: '5px'};
        return
      }
      
      // Forward register data to next step through dedicated service
      this.mySharingDataRegister.setData(this.user);
      
      // If user isn't exist in the system, move to next step
      this.myRouter.navigate(['./registerStepTwo']);
      
    } 
    catch (err) {
      console.log(err.message)
    }
  }

}
