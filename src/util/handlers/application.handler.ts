import { Sequelize } from "sequelize";
import { IHandler, Logger, Route } from "../common";
import { ApiHandler } from "./api.handler";
import { DatabaseHandler, DbConnection } from "./database.handler";

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
        return this.api !== undefined && this.db !== undefined;
    }

    public async initialize(logger: Logger, routes: Route[]): Promise<boolean> {
        this.api = new ApiHandler();
        this.db = new DatabaseHandler(
            <Sequelize> new DbConnection('postgres')
            .addUsername(process.env.DB_USERNAME || 'postgres')
            .addPassword(process.env.DB_PASSWORD || 'password')
            .addHost(process.env.DB_HOST || 'localhost')
            .addPort(Number.parseInt(process.env.DB_PORT || '5432'))
            .addDatabase(process.env.DB_DATABASE || 'postgres')
            .addDefine({
                paranoid: true, 
                createdAt: 'created_at', 
                updatedAt: 'updated_at', 
                deletedAt: 'deleted_at', 
            })
            .create()
            .getConnection()
        );

        let flags = [
            await this.db.initialize(logger, { force: true }), 
            this.api.initialize(
                logger, 
                routes
            )
        ];

        return flags.reduce((x: boolean, y: boolean) => x && y);
    }

    public run(port: number): void | never {
        if(this.isInitialized()) {
            return this.api!.run(port);
        }
        throw new Error('Application is not initialized');
    }
}
