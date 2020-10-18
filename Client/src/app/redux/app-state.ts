import { ItemCartModel } from "../models/item-cart-model";

export class AppState {

    // Item Store
    public items: ItemCartModel[];

    public constructor() { 
        this.items = [];
    }
        
}