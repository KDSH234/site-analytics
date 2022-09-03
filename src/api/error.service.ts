import { Response } from 'express';
import { validationResult } from 'express-validator';

@Injector()
export class ErrorService {

    errors = [
        {id: 0, text: 'Unknown Error!', status: 500}, //only for uncatched errors
        {id: 1, text: 'Something goes wrong!', status: 500},
        {id: 2, text: 'Password or email is incorrect', status: 401},
        {id: 3, text: 'User already exist!', status: 400},
        {id: 4, text: 'Object does not exist!', status: 404},
    ]


    error(res: Response, id: number = 1) {
        let exist = this.errors.find(i => i.id === id) || this.errors[0];
        res.status(exist.status).send({errors: [exist.text]});
    }
    

    validationHandler(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) { next(); } else res.status(400).send(errors);
        
     }

}