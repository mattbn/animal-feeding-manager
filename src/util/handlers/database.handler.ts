import { Options, Sequelize, SyncOptions, Dialect } from "sequelize";
import { BaseModel, Logger } from "../common";

/*
export class DatabaseConnection {
    private connection?: Sequelize;
    private options: Options;

    public constructor(dialect: Dialect) {
        this.options = { dialect: dialect };
    }

    public addProperty(property: keyof Options, value: any): DatabaseConnection {
        this.options[property] = value;
        return this;
    }

    public addUsername(username: string): DatabaseConnection {
        return this.addProperty('username', username);
    }

    public addPassword(password: string): DatabaseConnection {
        return this.addProperty('password', password);
    }

    public addHost(host: string): DatabaseConnection {
        return this.addProperty('host', host);
    }

    public addPort(port: number): DatabaseConnection {
        return this.addProperty('port', port);
    }

    public addDatabase(database: string): DatabaseConnection {
        return this.addProperty('database', database);
    }

    public addDefine(define: ModelOptions<Model>): DatabaseConnection {
        return this.addProperty('define', define);
    }

    public addLogging(
        logging: boolean | ((sql: string, timing?: number) => void)
    ): DatabaseConnection {
        return this.addProperty('logging', logging);
    }

    public create(): DatabaseConnection {
        this.connection = new Sequelize(this.options);
        return this;
    }

    public getConnection(): Sequelize | undefined {
        return this.connection;
    }
}
*/

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
