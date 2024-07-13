import express, { Express } from "express";
import { IHandler, Logger, Route } from "../common";
import http from "http";

export class ApiHandler implements IHandler {
    private app?: Express;
    private server?: http.Server;
    private initialized: boolean;
    private logger?: Logger;

    public constructor() {
        this.initialized = false;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public getServer(): http.Server | undefined {
        return this.server;
    }

    public initialize(logger: Logger, routes: Route[]): boolean {
        if(this.initialized) {
            return false;
        }
        let result = true;
        this.logger = logger;
        this.logger('Initializing API...');
        this.app = express();
    
        this.logger('Initializing routes...');
        routes.forEach((route: Route) => {
            this.logger!(`> Initializing /${route.name}...`);
            this.app!.use(`/${route.name}`, route.router);
        });
        this.initialized = result;
        return result;
    }

    public run(port: Number): void | never {
        if(!this.initialized) {
            throw new Error('API is not initialized');
        }
        this.server = this.app!.listen(port, () => {
            this.logger!(`Listening on port ${port}.`);
        });
    }
}
