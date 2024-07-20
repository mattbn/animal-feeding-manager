import express, { Express } from "express";
import { Logger, Route } from "../common";
import http from "http";

/**
 * Handles Express app initialization.
 */
export class ApiHandler {
    private app: Express;
    private server?: http.Server;
    private logger: Logger;
    private static instance?: ApiHandler;

    /**
     * Initializes the handler.
     */
    private constructor() {
        this.logger = console.log;
        this.app = express();
    }

    /**
     * @returns The Singleton instance.
     */
    public static getInstance(): ApiHandler {
        if(this.instance === undefined) {
            this.instance = new ApiHandler();
        }
        return this.instance;
    }

    /**
     * @returns The current logger
     */
    public getLogger(): Logger {
        return this.logger;
    }

    /**
     * @returns The HTTP server created by listening
     */
    public getServer(): http.Server | undefined {
        return this.server;
    }

    /**
     * Initializes the provided routes.
     * @param routes - The routes that will be initialized
     * @param logger - The logger that will be used
     */
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

    /**
     * Starts the application by listening on a port.
     * @param port - The port to listen on
     */
    public run(port: Number): void | never {
        this.server = this.app.listen(port, () => {
            this.logger(`Listening on port ${port}.`);
        });
    }
}
