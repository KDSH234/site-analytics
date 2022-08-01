import Express from 'express';
import { SettingsService } from './services/settings.service.js';
import { AuthService } from './api/auth.service.js';

@Injector()
export class Application {
    private app = Express();

    constructor(private settings: SettingsService, private authService: AuthService) {

        this.app.use('/api/auth', this.authService.router)
          
        this.app.listen(this.settings.port, () => {
            console.log(`App listening on port ${this.settings.port}`)
        })
    }

    prop() {
    }
}