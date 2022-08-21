import { Router, Request, Response, NextFunction } from "express";
import { SettingsService } from '../services/settings.service.js';
import { ErrorService } from './error.service.js';
import { SiteDBModel } from '../models/site.model.js';
import { from } from "rxjs";

@Injector()
export class StatisticService {
    router: Router = Router();

    constructor(private settingsService: SettingsService, private err: ErrorService) {
        this.router.post('/create', this.create.bind(this));
    }

    create(req: Request, res: Response, next: NextFunction) {
        this.settingsService.getTable('Site');
    }

}

