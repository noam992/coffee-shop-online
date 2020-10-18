import { NgForm, FormGroup } from '@angular/forms';
import { SharingDataWithHeaderService } from '../../../services/sharing-data/sharing-data-with-header.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserModel } from './../../../models/user-model';
import { Component, ViewChild } from '@angular/core';
import { IsOpenDrawerLogInParentService } from 'src/app/services/sharing-data/is-open-drawer-log-in-parent.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  public user = new UserModel();
  public userEmail: string
  public logInError: boolean = false
  @ViewChild('formInfo') public logInFormDirective: NgForm

  constructor(private myAuthenticationService: AuthenticationService,
              private myIsOpenLogInDrawerService: IsOpenDrawerLogInParentService,
              private mySharingUserNameHeaderParent: SharingDataWithHeaderService) { }

  public login() {

    this.user.email = this.userEmail

    this.myAuthenticationService.login(this.user)
      .subscribe(
        response => {

          // Save token in sessionStorage
          sessionStorage.setItem("token", response.headers.get("coffeeonlineshop"));
          sessionStorage.setItem("user", JSON.stringify(response.body.user));

          // Close log in drawer after successful log in 
          this.myIsOpenLogInDrawerService.isOpenLogInDrawer(true);

          // Operate function in header component to change "Guest" to user name
          this.mySharingUserNameHeaderParent.setUserNameOnHeader()

          // Clear form
          this.clearForm

        },
        error => {
          console.log(error.message)
          // Error message
          this.errorLogInConnected()
          
        }
      )

  }

  // Clear form
  public clearForm(){

    // clear Form
    this.logInFormDirective.resetForm();
    this.logInError = false

    // --- After register "user" key contain email's user only - Handle this occur and insert the email to form automatic --- // 
    // Get user info from session storage
    const userJson = sessionStorage.getItem('user');

    // Regex valid email
    const regexEmail = /^\w+[\w-\.]*\@([\w-]+\.)+[\w-]+$/.test(userJson);

    // If user "key" exist and it's email value binding variable to him
    if (userJson && regexEmail) {
      this.userEmail = userJson
    }

  }

  // Display log in error message  
  public errorLogInConnected(){
    this.logInError = true
  }

}
