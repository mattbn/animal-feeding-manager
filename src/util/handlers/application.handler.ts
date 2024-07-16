import { IHandler } from "../common";
import { ApiHandler } from "./api.handler";
import { DatabaseHandler } from "./database.handler";

export class ApplicationHandler implements IHandler {
    private api?: ApiHandler;
    private db?: DatabaseHandler;

    public getApiHandler(): ApiHandler | undefined {
        return this.api;
    }

    public getDatabaseHandler(): DatabaseHandler | undefined {
        return this.db;
    }

    public isInitialized(): boolean {
        return this.api !== undefined || this.db !== undefined;
    }

    public initialize(
        dbHandler?: DatabaseHandler, 
        apiHandler?: ApiHandler, 
    ): ApplicationHandler {
        this.api = apiHandler;
        this.db = dbHandler;
        return this;
    }
}
