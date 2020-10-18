import { CategoryModel } from './category-model';
export class ProductModel {
    public constructor(
        public _id?: string,
        public productName?: string,
        public productImg?: string | ArrayBuffer,
        public productImgType?: string,
        public productImgPath?: string,
        public productText?: string,
        public price?: number,
        public categoryId?: string,
        public category?: CategoryModel
    ) { }
}
