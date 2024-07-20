import { Options, Sequelize, SyncOptions, Dialect } from "sequelize";
import { BaseModel, Logger } from "../common";

/**
 * Handles sequelize DB connection initialization.
 */
export class DatabaseHandler {
    private connection: Sequelize;
    private static instance?: DatabaseHandler;

    /**
     * Initializes the handler.
     * @param options - Sequelize options that will be used in initialization
     */
    private constructor(options: Options) {
        this.connection = new Sequelize(options);
    }

    /**
     * @returns The Singleton instance.
     */
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

    /**
     * @returns Sequelize connection handle
     */
    public getConnection(): Sequelize {
        return this.connection;
    }

    /**
     * Initializes the provided models.
     * @param logger - The logger function that will be used
     * @param models - The models that will be initialized
     * @param options - Sequelize synchronization options
     */
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
