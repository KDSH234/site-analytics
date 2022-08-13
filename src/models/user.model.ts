import { ObjectId } from 'mongodb'

export class UserModel {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
}

export class UserSendModel {
    _id: string;
    name: string;
    email: string;

    constructor(user: UserModel) {
        this._id = user._id.toString();
        this.name = user.name;
        this.email = user.email;
    }
}