import express, { Express } from "express";
import { Logger, Route } from "../common";
import http from "http";

export class ApiHandler {
    private app: Express;
    private server?: http.Server;
    private logger: Logger;
    private static instance?: ApiHandler;

    private constructor() {
        this.logger = console.log;
        this.app = express();
    }

    public static getInstance(): ApiHandler {
        if(this.instance === undefined) {
            this.instance = new ApiHandler();
        }
        return this.instance;
    }

    public getLogger(): Logger {
        return this.logger;
    }

    public getServer(): http.Server | undefined {
        return this.server;
    }

    public initializeRoutes(routes: Route[], logger?: Logger): void {
        if(logger !== undefined) {
            this.logger = logger;
        }
        this.logger('Initializing routes...');
        routes.forEach((route: Route) => {
            this.logger(`> Initializing /${route.name}...`);
            this.app.use(`/${route.name}`, route.router);
        });
    }

    public run(port: Number): void | never {
        this.server = this.app.listen(port, () => {
            this.logger(`Listening on port ${port}.`);
        });
    }
}
