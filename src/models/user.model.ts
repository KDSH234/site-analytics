import { ObjectId } from 'mongodb'

export class UserBDModel {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    constructor(user: UserBDModel) {
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
    }
}

export class UserModel {
    _id: string;
    name: string;
    email: string;

    constructor(user: UserBDModel) {
        this._id = user._id.toString();
        this.name = user.name;
        this.email = user.email;
    }
}