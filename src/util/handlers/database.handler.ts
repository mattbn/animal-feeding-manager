import { Model, ModelOptions, Options, Sequelize, SyncOptions, Dialect } from "sequelize";
import { BaseModel, IHandler, Logger } from "../common";

export class DatabaseConnection {
    private connection?: Sequelize;
    private options: Options;

    public constructor(dialect: Dialect) {
        this.options = { dialect: dialect };
    }

    private addProperty(property: string, value: any): DatabaseConnection {
        this.options[<keyof Options> property] = value;
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

export class DatabaseHandler implements IHandler {
    private connection: Sequelize;
    private initialized: boolean;

    public constructor(connection: Sequelize) {
        this.connection = connection;
        this.initialized = false;
    }

    public getConnection(): Sequelize {
        return this.connection;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public async initialize(
        logger: Logger, 
        models: typeof BaseModel[], 
        options?: SyncOptions
    ): Promise<boolean> {
        if(this.initialized) {
            return false;
        }
        let result = true;
        Object.values(models).forEach((m: any) => m.init(
            m.prototype.getModelAttributes(), 
            m.prototype.getModelInitOptions(this.connection)
        ));
        Object.values(models).forEach((m: any) => m.prototype.associate());
        for(let m of models) {
            try { await m.sync(options); }
            catch(err: any) { logger(err); result = false; }
        }
        this.initialized = result;
        return result;
    }
}
