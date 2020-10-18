import { Binary } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertBase64ToImgSrcService {

  // Convert base64 string to image source
  public convertBase64ToImgSrc(binaryString: string) {

    // Get type image, to check if image is existing
    const imgType = binaryString.split(":")[1].split(";")[0];
    if (imgType === "undefined") {
      const noImgFound = "/assets/img/No-image-found.jpg"
      return noImgFound
    }
    
    // Get base64
    const base64 = (binaryString).split(",")[1];

    // Get beginner string of image source
    const initImgSrc = (binaryString).split(",")[0];

    // Organize initial of image source
    const initPartOne = initImgSrc.split(";")[0]
    const initPartTwo = initImgSrc.split(";")[2]
    const initStringSrc = `${initPartOne};${initPartTwo},`

    // Margin to one string that create image src
    const imageSrc = initStringSrc + base64
    
    return imageSrc

  }

}
