import { Router, Request, Response, NextFunction } from "express";
import { SettingsService } from '../../services/settings.service.js';
import { ErrorService } from '../error.service.js';
import { SchedulerService } from '../../services/scheduler.service.js';
import { SiteDBModel, SiteAddValidation, SitePutValidation } from '../../models/site.model.js';
import { CallResult, SiteCall } from '../../models/siteCall.model.js';
import { ObjectIdValidator } from '../../models/validation.model.js';
import * as https from 'node:https';
import { ObjectId } from 'mongodb';
import { checkSchema } from 'express-validator';
import { skipWhile, take } from "rxjs/operators";
import { hrtime } from 'node:process';

@Injector()
export class StatisticService {
    router: Router = Router();

    constructor(private settingsService: SettingsService, private err: ErrorService, private schedulerService: SchedulerService) {
        this.router.post('/create', checkSchema(SiteAddValidation), this.err.validationHandler, this.create.bind(this));
        this.router.get('/read', checkSchema({ _id: ObjectIdValidator }), this.err.validationHandler, this.read.bind(this));
        this.router.put('/update', checkSchema(SitePutValidation), this.err.validationHandler, this.update.bind(this));
        this.router.delete('/delete', checkSchema({ _id: ObjectIdValidator }), this.err.validationHandler, this.delete.bind(this));

        this.setCalls();

    }

    setCalls() {
        this.settingsService.DBReady.pipe(skipWhile(val => !val), take(1)).subscribe(state => {
            this.settingsService.getTable<SiteDBModel>('Site').find({}).forEach(site => {
                site.calls?.forEach(call => {
                    this.schedulerService.addActive(call.name, this.schedulerService.getCronSettings(call.type), (d) => {
                        this.makeCall(call, d);
                    });
                })
            });
        })
    }

    makeCall(call: SiteCall, date: string) {
        const options: https.RequestOptions = {
            method: call.method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const startTime = this.schedulerService.convertHrtime(hrtime.bigint());
        const req = https.request(call.url + '?' + call.qParams, options, (res) => {
            this.writeCall(call, res, date, startTime.milliseconds);
        });

        req.on('error', (e) => {
            console.error(e);
            this.writeCall(call, {}, date, startTime.milliseconds);
        });
        req.end();
    }

    async writeCall(call: SiteCall, res: any, date: string, startTime: number) {
        const endTime = this.schedulerService.convertHrtime(hrtime.bigint());
        let d = new Date(date);
        const table = this.settingsService.getTable<CallResult>('SiteCalls');
        const timing = endTime.milliseconds - startTime;
        let obj: CallResult = {date: d, siteCall_id: call._id, result: res.statusCode || 'UNKNOWN', timing};
        table.insertOne(obj);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        let insertSite = new SiteDBModel(req.body);
        let result = await this.settingsService.getTable('Site').insertOne(insertSite);
        result.insertedId ? res.status(200).send(insertSite) : this.err.error(res, 1);
    }

    async read(req: Request, res: Response, next: NextFunction) {
        let result = await this.settingsService.getTable('Site').findOne({ _id: new ObjectId(req.query._id as string) });
        result ? res.status(200).send(result) : this.err.error(res, 4);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        let insertSite = new SiteDBModel(req.body);
        let existOne = await this.settingsService.getTable('Site').findOne<SiteDBModel>({ _id: insertSite._id });
        insertSite.calls = existOne.calls;
        let result = await this.settingsService.getTable('Site').replaceOne({ _id: insertSite._id }, insertSite);
        result.matchedCount > 0 ? res.status(200).send(insertSite) : this.err.error(res, 4);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        let result = await this.settingsService.getTable('Site').deleteOne({ _id: new ObjectId(req.query._id as string) });
        result.deletedCount > 0 ? res.status(200).send({ result: true }) : this.err.error(res, 4);
    }

}

