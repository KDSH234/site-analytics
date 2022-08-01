import { Core } from './core.js';
import { SettingsService } from './src/services/settings.service.js';
import { AuthService } from './src/api/auth.service.js';
import { Application } from './src/index.js';

new Core({
    providers: [SettingsService, AuthService],
    modules: [Application]
});