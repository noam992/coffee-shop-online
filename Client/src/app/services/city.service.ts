import { Injectable } from '@angular/core';
import { CityModel } from './../models/city-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  public async getAllCity(): Promise<CityModel[]>{
    try {
     
      const citiesListObject = await this.http.get<CityModel[]>("./api/city").toPromise();
      
        // Convert cities list to array type
        let citiesArr = []
        let citiesList: CityModel[] = [];

        for (const city in citiesListObject) {
          citiesArr.push(citiesListObject[city])
        }
      
        for (let i = 0; i < citiesArr[0].length; i++) {         
          citiesList.push(citiesArr[0][i])
        }

        return citiesList
        
    }
    catch (err) {
      console.log(err.message)
    }
  }
}
