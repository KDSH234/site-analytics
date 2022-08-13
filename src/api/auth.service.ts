import { Router, Request, Response, NextFunction } from "express";
import { SettingsService } from '../services/settings.service.js';
import { ErrorService } from './error.service.js';
import { UserModel, UserSendModel } from '../models/user.model.js';
import { from } from "rxjs";

@Injector()
export class AuthService {
    router: Router = Router();

    constructor(private settingsService: SettingsService, private err: ErrorService) {
        this.router.post('/sign-in', this.signin.bind(this));
    }

    signin(req: Request<UserModel>, res: Response, next: NextFunction) {
        let email = (req.body as UserModel)?.email;
        let password = (req.body as UserModel)?.password;
        if(email && password) {
            from(this.settingsService.getTable('User').findOne({email})).subscribe((user) => {
                if(user) {
                    this.settingsService.comparePassword(password, user.password).subscribe(result => {
                        user.password = this.settingsService.encryptPassword(user.password);
                        result ? res.status(200).send(new UserSendModel(user as UserModel)) : 
                        this.err.error(res, 'Password or email is incorrect')
                    })
                } else this.err.error(res, 'Password or email is incorrect')
            });
        } else this.err.error(res, 'Password or email is incorrect')
    }
}

