export class OrderModel {
    public constructor(
        public _id?: string,
        public totalPrice?: number,
        public address?: string,
        public orderTime?: string,
        public deliveryTime?: any,
        public lastFourNumOfCard?: number,
        public userId?: string,
        public shoppingCartId?: string,
        public cityId?: string
    ) { }
}
