import { ConvertBase64ToImgSrcService } from './../../services/convert-base64-to-img-src.service';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductModel } from 'src/app/models/product-model';




@Component({
  selector: 'app-multi-item-gallery-component',
  templateUrl: './multi-item-gallery-component.component.html',
  styleUrls: ['./multi-item-gallery-component.component.css']
})
export class MultiItemGalleryComponentComponent implements OnInit {

  public imagesArray = [];
  public allProducts: ProductModel[];
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  constructor(private myProductService: ProductService,
              private myConvertBase64ToImgSrcService: ConvertBase64ToImgSrcService) { }

  ngOnInit(): void {

    // Get randomImages
    this.getRandomImages();

  }

  public getRandomImages(){

    // Get all the products
    this.myProductService.getAllProducts()
      .subscribe(
        products => {
          this.allProducts = products.body.products

          // Get one image from the products array by random number
          // push this image to array images "imagesArray"
          for (let i = 0; i < 10; i++) {

            const randomNum = this.getRandomNumber(this.allProducts.length)
        
            const randomImg = this.allProducts[randomNum].productImgPath;

            const convertImg = this.myConvertBase64ToImgSrcService.convertBase64ToImgSrc(randomImg)

            this.imagesArray.push(convertImg);
        
          }

        },
        error => console.log(error.message)
      );
    
  }

  // Get random number from 0 - length of products array
  public getRandomNumber(maxArr: number){

    const getRandomInt = Math.floor(Math.random() * Math.floor(maxArr));

    return getRandomInt

  }



}