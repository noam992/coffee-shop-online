import { Injectable } from '@angular/core';
import { UserModel } from '../models/user-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  // Get user details
  public getSpecificUser(userId: string): Promise<UserModel[]>{
    return this.http.get<UserModel[]>("./api/user/" + userId).toPromise();
  }

  // Check first process's register
  public firstStepOfRegister(userFirstStep: UserModel): Promise<any>{
    return this.http.post<UserModel[]>("./api/auth/register/stepOne", userFirstStep).toPromise();
  }

  // Add new user - end of register process
  public addNewUser(userDetails: UserModel): Observable<any>{
    return this.http.post<UserModel[]>("./api/auth/register", userDetails, {
      observe: "response"
    })
  }

  // Add new user - end of register process
  public login(userDetails: UserModel): Observable<any>{
    return this.http.post<UserModel[]>("./api/auth/login", userDetails, {
      observe: "response"
    })
  }

}
