import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class CalculationFunctionsService {

  // Compute sum of price and amount
  public sumByPriceAndAmount(price: number, amount: number) {

    const TotalPrice = price * amount;

    return TotalPrice

  }

  // Validation function for model driven form
  // To use that you have pass it to the list of validators on component
  public luhnCheck(control: FormControl) {

    // Get the card number from the value property of the control
    let cardNum = control.value

    // If it already contains an Act character
    if (cardNum) {
      
      // Flip index string
      const flipVat = cardNum.split( '' ).reverse( ).join( '' );
      
      const sum = [].reduce.call(
        String(flipVat),
        (result: number, num: string, index: number) => {
          let value = parseInt(num, 10);
          if (index % 2) {
            value *= 2;
            if (value > 9) {
              value = 1 + (value % 10);
            }
          }
          return result + value;
        },
        0,
      );
        
      const computeModSum = sum % 10 === 0;

      // Return error object only if "computeModSum" is not true
      if (computeModSum !== true) {
        return {
          isLuhnCheck: {
            errorCalculation: sum 
          }
        }
      }
      
      // Validate has passed so return null
      return null;
    }    
  }

}
