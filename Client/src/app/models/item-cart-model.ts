import { ProductModel } from './product-model';

export class ItemCartModel {
    public constructor(
        public _id?: string,
        public amount?: number,
        public totalPriceByAmount?: number,
        public shoppingCartId?: string,
        public productId?: string,
        public product?: ProductModel
    ) {
        if (!product) {
            this.product = new ProductModel();
        }
    }
}
