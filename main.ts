import { Core } from './core.js';
import { SettingsService } from './src/services/settings.service.js';
import { AuthService } from './src/api/auth.service.js';
import { ErrorService } from './src/api/error.service.js';
import { StatisticService } from './src/api/statistic.serivce.js';
import { Application } from './src/index.js';

new Core({
    providers: [ErrorService, SettingsService, AuthService, StatisticService],
    modules: [Application]
});