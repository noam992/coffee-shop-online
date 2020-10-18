import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingDataWithCartService {

  // After complete order, send finish process to cart component that cart could refresh his cart
  private isOrderProcessFinished: boolean = undefined

  public setDataFromOrder(isFinishedProcess: boolean){
    this.isOrderProcessFinished = isFinishedProcess;
  }

  public getDataFromOrder() {
    return this.isOrderProcessFinished;
  }
}
