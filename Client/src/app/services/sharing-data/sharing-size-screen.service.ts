import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingSizeScreenService {

  // Observable string sources, A Subject is like an Observable, but can multicast to many Observers
  private sharingSizeScreenSource = new Subject<any>();
  private currentSize: string

  // Observable string streams
  public sizeScreenCalled$ = this.sharingSizeScreenSource.asObservable();

  // Get size screen from Layout component when the size is change.
  // Any component that listening to current service will get that data and change according to
  public whichSizeScreenIs(sizeScreen: string) {

    // Send date for any components that subscribe to variable
    this.sharingSizeScreenSource.next(sizeScreen);

    // Save current screen size into local variable
    this.currentSize = sizeScreen;
  }

  public getCurrentSize() {
    return this.currentSize;
  }

}
