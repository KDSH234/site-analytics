import { Core } from './core.js';
import { SettingsService } from './src/services/settings.service.js';
import { AuthService } from './src/api/auth/auth.service.js';
import { ErrorService } from './src/api/error.service.js';
import { StatisticService } from './src/api/statistic/statistic.serivce.js';
import { CallsService } from './src/api/calls/calls.service.js';
import { SchedulerService } from './src/api/scheduler/scheduler.service.js';
import { Application } from './src/index.js';

new Core({
    providers: [SchedulerService, ErrorService, SettingsService, AuthService, StatisticService, CallsService],
    modules: [Application]
});