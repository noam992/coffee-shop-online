export class MessageModel {
    public constructor(
        public _id?: string,
        public message?: string,
        public messageTime?: string,
        public chatId?: string,
    ) { }
}
