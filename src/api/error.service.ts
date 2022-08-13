import { Response } from 'express';

@Injector()
export class ErrorService {


    error(res: Response, error: string) {
        res.status(401).send({error});
    }

    crash(res: Response, error: string) {
        res.status(500).send({error});
    }
}