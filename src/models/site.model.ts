import { Schema } from 'express-validator';
import { ObjectId } from 'mongodb';
import { ObjectIdValidator } from './validation.model.js';
import { SiteCall } from './siteCall.model.js';

export class SiteDBModel {
    _id?: ObjectId;
    name: string;
    description: string;
    color: string;
    warnColor: string;
    errColor: string;
    calls?: SiteCall[] = [];
    constructor(user: SiteDBModel) {
        this._id = user._id && ObjectId.isValid(user._id) ? new ObjectId(user._id) : undefined;
        this.name = user.name;
        this.description = user.description;
        this.color = user.color;
        this.warnColor = user.warnColor;
        this.errColor = user.errColor;
        this.calls = user.calls;
    }
}

export const SiteAddValidation: Schema = {
    name: {
        isString: {
            errorMessage: 'Must be a string!'
        },
        isLength: {
            errorMessage: 'Name must be at least 3 and max 255 symbols!',
            options:  { max: 255, min: 3 }
        }
    },
    description: {
        isString: {
            errorMessage: 'Must be a string!'
        },
        isLength: {
            errorMessage: 'Name must be max 255 symbols!',
            options:  { max: 255 }
        }
    },
    color: {
        isHexColor: {
            errorMessage: 'Must be HEX Color in format "#ccc"'
        }
    },
    warnColor: {
        isHexColor: {
            errorMessage: 'Must be HEX Color in format "#ccc"'
        }
    },
    errColor: {
        isHexColor: {
            errorMessage: 'Must be HEX Color in format "#ccc"'
        }
    }
}

export const SitePutValidation: Schema = {
    ...SiteAddValidation,
    _id: ObjectIdValidator
}