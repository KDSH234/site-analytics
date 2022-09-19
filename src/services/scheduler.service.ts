import { scheduleJob, Job } from 'node-schedule';

@Injector()
export class SchedulerService {

    private activeJobs: Job[] = [];

    addActive(name: string, pattern: string, callback: Function) {
        console.log(name, pattern);
        this.activeJobs.push(scheduleJob(name, pattern, (d) => {
            callback(d);
        }));
    }

    resetScheduler() {
        this.activeJobs.forEach(Job => {
            Job.cancel();
        })
    }

    convertHrtime(hrtime: bigint) {
        const nanoseconds = hrtime;
        const number = Number(nanoseconds);
        const milliseconds = number / 1000000;
        const seconds = number / 1000000000;
    
        return {
            seconds,
            milliseconds,
            nanoseconds
        };
    }

    getCronSettings(type: number): string {
        switch(+type) {
            case 1:
                return '*/5 * * * *';
            case 2:
                return '*/15 * * * *';
            case 3:
                return '*/30 * * * *';
            case 4:
                return '0 */1 * * *';
            case 5:
                return '0 */2 * * *';
            case 6:
                return '0 */4 * * *';
            case 7:
                return '0 */6 * * *';
            case 8:
                return '0 */8 * * *';
            case 9:
                return '0 */12 * * *';
            case 10:
                return '0 0 */1 * *';
            case 11:
                return '0 0 */7 * *';
            case 12:
                return '0 0 */14 * *';
            default:
                break;
        }
    }
    
    
}

