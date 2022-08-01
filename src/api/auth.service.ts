import { Router, Request, Response, NextFunction } from "express"

@Injector()
export class AuthService {
    router: Router = Router();

    constructor() {
        this.router.use('/sign-in', this.signin);
    }

    
    signin(req: Request, res: Response, next: NextFunction) {
        console.log('%s %s %s', req.method, req.url, req.path)
        next();
    }
}

