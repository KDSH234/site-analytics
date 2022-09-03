import { Router, Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { SettingsService } from '../../services/settings.service.js';
import { ErrorService } from '../error.service.js';
import { SiteDBModel } from '../../models/site.model.js';
import { SiteCall, SiteCallAddValidation, SiteCallPutValidation, Type } from '../../models/siteCall.model.js';
import { checkSchema } from 'express-validator';
import { ObjectIdValidator } from "../../models/validation.model.js";

@Injector()
export class CallsService {
    router: Router = Router();

    constructor(private settingsService: SettingsService, private err: ErrorService) {
        this.router.post('/create', checkSchema(SiteCallAddValidation), this.err.validationHandler, this.create.bind(this));
        this.router.put('/put', checkSchema(SiteCallPutValidation), this.err.validationHandler, this.put.bind(this));
        this.router.delete('/delete', checkSchema({_id: ObjectIdValidator}), this.err.validationHandler, this.delete.bind(this));
    }

    async create(req: Request, res: Response, next: NextFunction) {
        let insertSiteCall = new SiteCall(req.body);
        insertSiteCall._id = new ObjectId();
        let result = await this.settingsService.getTable<SiteDBModel>('Site').findOneAndUpdate({_id: insertSiteCall.site_id, }, { $push: { calls: insertSiteCall } });
        if(!result.value) this.err.error(res, 4);
        else res.status(200).send(insertSiteCall);
    }

    async put(req: Request, res: Response, next: NextFunction) {
        let insertSiteCall = new SiteCall(req.body);
        let result = await this.settingsService.getTable<SiteDBModel>('Site').findOneAndUpdate({_id: insertSiteCall.site_id, calls: { $elemMatch: { _id: insertSiteCall._id }}}, { $set: { "calls.$": insertSiteCall } });
        if(!result.value) this.err.error(res, 4);
        else res.status(200).send(insertSiteCall);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        let id = new ObjectId(req.query._id as string);
        let result = await this.settingsService.getTable<SiteDBModel>('Site').findOneAndUpdate({calls: {$elemMatch: {_id: id}}}, { $pull: { "calls": { _id: id } } });
        if(!result.value) this.err.error(res, 4);
        else res.status(200).send({ result: true });
    }

}

