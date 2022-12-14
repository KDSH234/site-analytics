import "reflect-metadata";

global.Injector = () => {
    return function <T>(target: Type<T>) {
    //   console.log(Reflect.getMetadata("design:paramtypes", target), 'INJECTOR');
    };
  }

interface Type<T> {
    new (...args: any[]): T;
}

interface CA {
    providers: any[];
    modules: any[];
}

export class Core {
    private providerStorage: any[] = [];
    private modulesStorage: any[] = [];
    constructor(
        args: CA
    ) {
        args.providers.forEach(Serv => this.providerStorage.push(this.getMetaServices(Serv)));
        this.modulesStorage = args.modules.map(Mod => this.getMetaServices(Mod));
    }

    getMetaServices(Mod) {
        let metaClasses = Reflect.getMetadata('design:paramtypes', Mod); // [ [Function: Service1], [Function: Service2] ]
        let constructorServices = [];
        if(metaClasses) {
            for(let i = 0; i < metaClasses.length; i++) {
                let arg = metaClasses[i];
                let exist = this.providerStorage.find(s => s instanceof arg);
                if(exist) constructorServices.push(exist);
                else {
                    throw new Error(`Requested by module '${Mod.name}' - '${arg.name}' does not exist on Application`)
                }
            }
        }
        return !constructorServices.length ? new Mod() : new Mod(...constructorServices);
    }
}