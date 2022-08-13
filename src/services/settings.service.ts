import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { from, Observable } from 'rxjs';

@Injector()
export class SettingsService {
    port = 80;
    mongoDBConnection = `mongodb://localhost:27017`;

    private saltRounds = 10;

    private MongoClient: MongoClient;

    runDB(): Observable<MongoClient> {
        this.MongoClient = new MongoClient(this.mongoDBConnection);
        return from(this.MongoClient.connect());
    }

    getTable(type: string) {
        return this.MongoClient.db('Analytics-Site').collection(type);
    }

    closeDB() {
        this.MongoClient.close();
    }

    encryptPassword(password: string) {
        return new Observable<string>(o => {
            bcrypt.hash(password, this.saltRounds, (err, hash) => {
                if(err) o.error(err);
                else o.next(hash);
                o.complete();
            });
        });
    }

    comparePassword(password, encPassword) {
        return new Observable<boolean>(o => {
            bcrypt.compare(password, encPassword, (err, result) => {
                if(err) o.error(err);
                else o.next(result);
                o.complete();
            });
        })
    }


}

