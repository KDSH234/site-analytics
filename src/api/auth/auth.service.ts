import { Router, Request, Response, NextFunction } from "express";
import { SettingsService } from '../../services/settings.service.js';
import { ErrorService } from '../error.service.js';
import { UserModel, UserBDModel, SignInValidation, SignUpValidation } from '../../models/user.model.js';
import { checkSchema } from 'express-validator';

@Injector()
export class AuthService {
    router: Router = Router();

    constructor(private settingsService: SettingsService, private err: ErrorService) {
        this.router.post('/sign-in', checkSchema(SignInValidation), this.err.validationHandler, this.signin.bind(this));
        this.router.post('/sign-up', checkSchema(SignUpValidation), this.err.validationHandler, this.signup.bind(this));
    }

    async signin(req: Request, res: Response, next: NextFunction) {
        let email = req.body?.email;
        let password = req.body?.password;
        let user = await this.settingsService.getTable<UserBDModel>('User').findOne({email});
        let encPassSame = user && await this.settingsService.comparePassword(password, user.password);
        user && encPassSame ? res.status(200).send(new UserModel(user as UserBDModel)) : this.err.error(res, 2);
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        let email = req.body?.email;
        let password = req.body?.password;
        let name = req.body?.name;

        let user = await this.settingsService.getTable<UserBDModel>('User').findOne({email});
        if(user) this.err.error(res, 3);
        else {
            let d = await this.settingsService.encryptPassword(password);
            let insertUser = new UserBDModel({email, password: d, name});
            await this.settingsService.getTable<UserBDModel>('User').insertOne(insertUser);
            res.status(200).send(new UserModel(insertUser));
        }
    }
}

