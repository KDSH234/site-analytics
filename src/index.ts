import Express from 'express';
import { MongoClient } from 'mongodb';
import { SettingsService } from './services/settings.service.js';
import { AuthService } from './api/auth/auth.service.js';
import { ErrorService } from './api/error.service.js';
import { StatisticService } from './api/statistic/statistic.serivce.js';
import { CallsService } from './api/calls/calls.service.js';
import { from, Observable } from 'rxjs';

@Injector()
export class Application {
    private app = Express();
    private DB: Observable<MongoClient>;

    constructor(
        private settings: SettingsService, 
        private authService: AuthService, 
        private err: ErrorService, 
        private statisticService: StatisticService, 
        private callsService: CallsService
    ) {  
        //run DB
        this.DB = this.settings.runDB();
        this.registerListeners();

        //sub to DB Response
        this.DB.subscribe({
            next: (v) => {},
            error: (e) => { this.settings.closeDB(); console.error('ERROR DB IS NOT STARTED') },
            complete: () => {
                console.info('DB IS RUNNING');
                this.settings.DBReady.next(true);
                //Listen to App
                this.app.listen(this.settings.port, () => {
                    console.info(`App listening on port ${this.settings.port}`);
                });
            }
        });

    }

    registerListeners() {
        //for parsing application/json
        this.app.use(Express.json());
        //register all rotuers
        this.app.use('/api/auth', this.authService.router);
        this.app.use('/api/statistic', this.statisticService.router);
        this.app.use('/api/calls', this.callsService.router);

        this.app.use(function(err, req, res, next) {
            console.error(err.stack);
            this.err.error(res, 0)
        });
        console.info('LISTENERS REGISTERED');
    }

}