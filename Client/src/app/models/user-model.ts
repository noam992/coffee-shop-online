export class UserModel {
    public constructor(
        public _id?: string,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public identityCard?: string,
        public password?: string,
        public address?: string,
        public phoneNumbers = {
            homeNumber: undefined,
            smartPhoneOne: undefined,
            smartPhoneTwo: undefined,
            smartPhoneThree: undefined
        },
        public isAdmin?: number,
        public cityId?: string,

    ) { }
}
