import { CategoryService } from './../../services/category.service';
import { ProductService } from './../../services/product.service';
import { CategoryModel } from './../../models/category-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, NgForm, FormGroup, Validators, FormGroupDirective } from "@angular/forms";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {

  public product = new ProductModel;
  public categories: CategoryModel[] = [];
  public imgUrl: string = undefined
  public form: FormGroup;
  public selectedFile: File;
  public fileName:string = "No file selected";

  constructor(private myCategoryService: CategoryService,
              private myProductService: ProductService,
              private myFormBuilder: FormBuilder)
    {this.createProductForm();}

  async ngOnInit() {
    try {

      // Get all category
      this.categories = await this.myCategoryService.getAllCategory();

    } catch (err) {
      console.log(err.message)
    }
  }

  // Preview Image and insert file to form
  public onFileSelected(event) {

    // Get file from input and create preview
    let reader = new FileReader()

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.imgUrl = event.target.result 
    }

    // Get file name
    const ImgValue = this.form.get('productImg').value
    this.fileName = ImgValue._fileNames
    
    // Insert input file to variable
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      productImg: file
    })
    this.form.get('productImg').updateValueAndValidity()
  }

  // validation and form
  createProductForm() {
    this.form = this.myFormBuilder.group({
      productName: [this.product.productName, [
        Validators.required
      ]],
      productImg: [null, [
        Validators.required
      ]],
      productText: [this.product.productText, [
        Validators.required
      ]],
      price: [this.product.price, [
        Validators.required
      ]],
      productCategoryId: [this.product.categoryId, [
        Validators.required
      ]]
    }) 
  }

  public addProduct() {

    // Convert to FormData
    let myFormData:any = new FormData();
    myFormData.append("productName", this.form.get('productName').value);
    myFormData.append("productImg", this.form.get('productImg').value);
    myFormData.append("productText", this.form.get('productText').value);
    myFormData.append("price", this.form.get('price').value);
    myFormData.append("categoryId", this.form.get('productCategoryId').value);

    // Add new product
    this.myProductService.addProduct(myFormData)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%')
          } else if (event.type === HttpEventType.Response) {
            // clear Form
            this.form.reset()
          }
        },
        error => console.log(error.message)
      )

  }

    
  public submitForm(formDirective: FormGroupDirective): void {
    formDirective.resetForm();
    this.form.reset();
    this.imgUrl  = undefined
    this.fileName = "No file selected";
  }

}
