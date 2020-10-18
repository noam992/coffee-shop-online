import { UserModel } from '../../models/user-model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SharingDataRegisterService {

  private userRegisterProcess: UserModel = undefined

  public setData(userRegisterStepOne: UserModel){
    this.userRegisterProcess = userRegisterStepOne;
  }

  public getData() {
    return this.userRegisterProcess;
  }
  
}

