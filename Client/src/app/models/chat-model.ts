import { UserModel } from './user-model';

export class ChatModel {
    public constructor(
        public _id?: string,
        public createdDate?: string,
        public userId?: UserModel
    ) { 
        if (!userId) {
            this.userId = new UserModel();
        }
    }
}
