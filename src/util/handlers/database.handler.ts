import { Options, Sequelize, SyncOptions, Dialect } from "sequelize";
import { BaseModel, Logger } from "../common";

export class DatabaseHandler {
    private connection: Sequelize;
    private static instance?: DatabaseHandler;

    private constructor(options: Options) {
        this.connection = new Sequelize(options);
    }

    public static getInstance(): DatabaseHandler {
        if(this.instance === undefined) {
            this.instance = new DatabaseHandler({
                dialect: (process.env.DB_DIALECT || 'postgres') as Dialect, 
                username: process.env.DB_USERNAME || 'postgres', 
                password: process.env.DB_PASSWORD || 'password', 
                host: process.env.DB_HOST || 'localhost', 
                port: parseInt(process.env.DB_PORT || '5432'), 
                database: process.env.DB_DATABASE || 'postgres', 
                define: {
                    createdAt: 'created_at', 
                    updatedAt: 'updated_at', 
                    deletedAt: 'deleted_at', 
                    paranoid: false, 
                }, 
                dialectOptions: {
                    useUTC: true, 
                }
            });
        }
        return this.instance;
    }

    public getConnection(): Sequelize {
        return this.connection;
    }

    public async initializeModels(
        logger: Logger, 
        models: typeof BaseModel[], 
        options?: SyncOptions
    ): Promise<void | never> {
        Object.values(models).forEach((m: any) => m.init(
            m.prototype.getModelAttributes(), 
            m.prototype.getModelInitOptions(this.connection)
        ));
        Object.values(models).forEach((m: any) => m.prototype.associate());
        for(let m of models) {
            try {
                await m.sync(options);
            }
            catch(err: any) {
                logger(err);
            }
        }
    }
}
