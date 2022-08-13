import Express from 'express';
import { MongoClient } from 'mongodb';
import { SettingsService } from './services/settings.service.js';
import { AuthService } from './api/auth.service.js';
import { ErrorService } from './api/error.service.js';
import { from, Observable } from 'rxjs';

@Injector()
export class Application {
    private app = Express();
    private DB: Observable<MongoClient>;

    constructor(private settings: SettingsService, private authService: AuthService, private err: ErrorService) {
        this.app.use(Express.json()) // for parsing application/json
        //register all rotuers
        this.app.use('/api/auth', this.authService.router);

        this.app.use(function(err, req, res, next) {
            console.error(err.stack);
            this.err.crash(res, 'Something is wrong!');
        });
        
        //run DB
        this.DB = this.settings.runDB();

        //sub to DB Response
        this.DB.subscribe({
            next: (v) => {},
            error: (e) => {this.settings.closeDB(); console.error('ERROR DB IS NOT STARTED')},
            complete: () => {
                console.info('DB IS RUNNING');
                //Listen to App
                this.app.listen(this.settings.port, () => {
                    console.log(`App listening on port ${this.settings.port}`);
                });
            }
        });

    }

}