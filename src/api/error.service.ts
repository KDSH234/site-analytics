import { Response } from 'express';

@Injector()
export class ErrorService {

    errors = [
        {id: 0, text: 'Unknown Error!', status: 500},
        {id: 1, text: 'Something goes wrong!', status: 500},
        {id: 2, text: 'Password or email is incorrect', status: 401},
        {id: 3, text: 'User already exist!', status: 400},
    ]


    error(res: Response, id: number = 1) {
        let exist = this.errors.find(i => i.id === id) || this.errors[0];
        res.status(exist.status).send({error: exist.text});
    }

}