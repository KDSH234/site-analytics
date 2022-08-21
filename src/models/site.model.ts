import { ObjectId } from 'mongodb';

export class SiteDBModel {
    _id?: ObjectId;
    name: string;
    description: string;
    color: string;
    warnColor: string;
    errColor: string;
    calls: Call[] = [];
    constructor(user: SiteDBModel) {
        this._id = user._id;
        this.name = user.name;
        this.description = user.description;
        this.color = user.color;
        this.warnColor = user.warnColor;
        this.errColor = user.errColor;
        this.calls = user.calls;
    }
}

export class Call {
    _id?: ObjectId;
    name: string;
    url: string;
    type: string;
    body?: JSON;
}