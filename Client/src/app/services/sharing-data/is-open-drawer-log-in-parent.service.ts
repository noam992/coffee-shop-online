import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsOpenDrawerLogInParentService {

  // Observable string sources, A Subject is like an Observable, but can multicast to many Observers
  private componentMethodCallSource = new Subject<any>();

  // Observable string streams
  public drawerFunctionCalled$ = this.componentMethodCallSource.asObservable();

  // Service message commands
  public isOpenLogInDrawer(isOpen: boolean) {
    this.componentMethodCallSource.next(isOpen);
  }

}
