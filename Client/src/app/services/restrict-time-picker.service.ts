import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestrictTimePickerService {

  // Create object that contain max and min date from next month 
  public RestrictForOneMonth(){

    // Object, contain min and max dates
    const restrictTimeOneMonthRange = {
      minTime: '',
      maxTime: ''
    }  

    // Get current date
    const dateObj = new Date();

    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    
    // Create current time for min date, --- fix month is -1 ---
    restrictTimeOneMonthRange.minTime = `${year}/${month}/${day}`;

    // Create max date
    // If current month is smaller then 12, max date will keep hold current year
    // But if current mount is equal to 12, max date need to get next year and month 01 (January)
    if (month < 12) {
      restrictTimeOneMonthRange.maxTime = `${year}/${month+1}/${day}`;
    }else {
      restrictTimeOneMonthRange.maxTime = `${year+1}/01/${day}`;
    }

    return restrictTimeOneMonthRange
  }

}
