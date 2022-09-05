import { Schema } from 'express-validator';
import { ObjectId } from 'mongodb';
import { ObjectIdValidator } from './validation.model.js';

export enum Type {
    Minutes5,
    Minutes15,
    Minutes30,
    Hour1,
    Hour2,
    Hour4,
    Hour6,
    Hour8,
    Hour12,
    Day1,
    Day7,
    Day14,
}

type AllowedMethods = 'post' | 'get' | 'delete' | 'put';

export class SiteCall {
    _id?: ObjectId;
    site_id: ObjectId;
    name: string;
    url: string;
    method: AllowedMethods;
    type: Type;
    body?: JSON;
    qParams?: string;
    constructor(siteCall: SiteCall) {
        this._id = siteCall._id && ObjectId.isValid(siteCall._id) ? new ObjectId(siteCall._id) : undefined;
        this.site_id = siteCall.site_id && ObjectId.isValid(siteCall.site_id) ? new ObjectId(siteCall.site_id) : undefined;
        this.name = siteCall.name;
        this.url = siteCall.url;
        this.type = siteCall.type;
        this.body = siteCall.body;
        this.qParams = siteCall.qParams;
    }
}

export class CallResult {
    _id?: ObjectId;
    siteCall_id: ObjectId;
    result: string;
    date: Date;
    timing: number;
}

export const SiteCallAddValidation: Schema = {
    site_id: ObjectIdValidator,
    name: {
        isString: {
            errorMessage: 'Must be a string!'
        },
        isLength: {
            errorMessage: 'Name must be at least 3 and max 255 symbols!',
            options:  { max: 255, min: 3 }
        }
    },
    url: {
        isString: {
            errorMessage: 'Must be a string!'
        },
        isLength: {
            errorMessage: 'Name must be max 255 symbols!',
            options:  { max: 255 }
        }
    },
    method: {
        custom: {
            options: (value, { req, location, path }) => {
                let includes = ['post', 'get', 'delete', 'put'].includes(value);
                return includes ? value : false;
            },
            errorMessage: `Type must be one of 'post', 'get', 'delete', 'put'`,
          },
    },
    type: {
        custom: {
            options: (value, { req, location, path }) => {
                return Type[value] !== undefined;
            },
            errorMessage: 'Type must be one of ' + Object.keys(Type),
          },
    },
    qParams: {
        optional: true,
        isString: {
            errorMessage: 'Must be a string!'
        }
    },
    body: {
        optional: true,
        isJSON: {
            errorMessage: 'Must be a JSON!'
        },
    }
}

export const SiteCallPutValidation: Schema = {
    ...SiteCallAddValidation,
    _id: ObjectIdValidator
}