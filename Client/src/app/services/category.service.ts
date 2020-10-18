import { CategoryModel } from './../models/category-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public async getAllCategory(): Promise<CategoryModel[]>{
    try {
      const categoriesObject = await this.http.get<CategoryModel[]>("./api/category").toPromise();

      // Convert categories list to one array type
      let categoryArr = []
      let categories: CategoryModel[] = []

      for (const category in categoriesObject) {
        categoryArr.push(categoriesObject[category])
      }
              
      for (let i = 0; i < categoryArr[0].length; i++) {         
        categories.push(categoryArr[0][i])
      }

      return categories
      
    } catch (err) {
      console.log(err.message)
    }
  }

}
