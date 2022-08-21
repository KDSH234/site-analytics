import { Router, Request, Response, NextFunction } from "express";
import { SettingsService } from '../services/settings.service.js';
import { ErrorService } from './error.service.js';
import { UserModel, UserBDModel } from '../models/user.model.js';
import { from } from "rxjs";
import { map } from "rxjs/operators";

@Injector()
export class AuthService {
    router: Router = Router();

    constructor(private settingsService: SettingsService, private err: ErrorService) {
        this.router.post('/sign-in', this.signin.bind(this));
        this.router.post('/sign-up', this.signup.bind(this));
    }

    signin(req: Request, res: Response, next: NextFunction) {
        let email = req.body?.email;
        let password = req.body?.password;
        if(email && password) {
            from(this.settingsService.getTable('User').findOne({email})).subscribe((user) => {
                if(user) {
                    this.settingsService.comparePassword(password, user.password).subscribe(result => {
                        user.password = this.settingsService.encryptPassword(user.password);
                        result ? res.status(200).send(new UserModel(user as UserBDModel)) : 
                        this.err.error(res, 2)
                    })
                } else this.err.error(res, 2)
            });
        } else this.err.error(res, 2)
    }

    signup(req: Request, res: Response, next: NextFunction) {
        let email = req.body?.email;
        let password = req.body?.password;
        let name = req.body?.name;
        if(email && password && name) {
            from(this.settingsService.getTable('User').findOne({email})).subscribe((user) => {
                if(user) this.err.error(res, 3);
                else {
                    this.settingsService.encryptPassword(password).subscribe(d => {
                        let insertUser = new UserBDModel({email, password: d, name});
                        from(this.settingsService.getTable('User').insertOne(insertUser)).subscribe(result => {
                            res.status(200).send(new UserModel(insertUser));
                        })
                    })

                }
            });
        } else this.err.error(res, 2);
    }
}

