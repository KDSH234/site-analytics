import { ObjectId } from 'mongodb';
import { Schema } from 'express-validator';

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

export let SignUpValidation: Schema = {
    name: {
        isString: {
            errorMessage: 'Must be a string!'
        },
        isLength: {
            errorMessage: 'Name must be at least 3 and max 255 symbols!',
            options:  { max: 255, min: 3 }
        }
    },
    email: {
        isEmail: {
            errorMessage: 'Email is invalid!'
        }
    },
    password: {
        isString: {
            errorMessage: 'Must be a string!'
        },
        isLength: {
            errorMessage: 'Name must be at least 3 and max 255 symbols!',
            options:  { max: 255, min: 3 }
        },
        isStrongPassword: {
            errorMessage: 'Password must have at least 1 Lowercase letter, 1 Uppercase letter, 1 Number, 1 Symbol',
            options: {
                minLength: 8, 
                minLowercase: 1, 
                minUppercase: 1, 
                minNumbers: 1, 
                minSymbols: 1, 
                returnScore: false,
            }
        }
    },
}

export let SignInValidation: Schema = {
    email: {
        isString: {
            errorMessage: 'Must be a string!'
        },
        isEmpty: {
            negated: true,
            errorMessage: 'Must be not null!'
        }
    },
    password: {
        isString: {
            errorMessage: 'Must be a string!'
        },
        isEmpty: {
            negated: true,
            errorMessage: 'Must be not null!'
        }
    },
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