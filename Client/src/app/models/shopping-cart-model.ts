import { UserModel } from "./user-model";

export class ShoppingCartModel {
    public constructor(
        public _id?: string,
        public createdData?: string,
        public userId?: string,
        public user?: UserModel
    ) { 
        if (!userId) {
            this.user = new UserModel();
        }
    }
}
