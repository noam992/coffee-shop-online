import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingDataWithHeaderService {

    // ------ Connected log in to header ------ //
    // Observable string sources, A Subject is like an Observable, but can multicast to many Observers
    private componentMethodCallSource = new Subject<any>();

    // Observable string streams
    public drawerFunctionCalled$ = this.componentMethodCallSource.asObservable();
  
    // Service message commands - component one that operate a component two
    public setUserNameOnHeader() {
      this.componentMethodCallSource.next();
    }

    // ------ Connected header to shopping page ------ //
    // Multicast to many Observers for open drawer cart
    private subjectDrawerCart = new Subject<any>();

    // Observable string streams
    public drawerCalled$ = this.subjectDrawerCart.asObservable(); 

    // Service message commands - component one that operate a component two
    public openDrawerCart() {
      this.subjectDrawerCart.next();
    }

    // ------ Connected header to home ------ //
    // Multicast to many Observers for open drawer cart
    private subjectSignOut = new Subject<any>();

    // Observable string streams
    public signOutCalled$ = this.subjectSignOut.asObservable(); 

    // Service message commands - component one that operate a component two
    public signOutStatus() {
      this.subjectSignOut.next();
    }

}
