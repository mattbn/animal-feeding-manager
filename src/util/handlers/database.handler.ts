import { Model, ModelOptions, Options, Sequelize, SyncOptions, Dialect } from "sequelize";
import { IHandler, Logger } from "../common";

export class DbConnection {
    private connection?: Sequelize;
    private options: Options;

    public constructor(dialect: Dialect) {
        this.options = { dialect: dialect };
    }

    private addProperty(property: string, value: any): DbConnection {
        this.options[<keyof Options> property] = value;
        return this;
    }

    public addUsername(username: string): DbConnection {
        return this.addProperty('username', username);
    }

    public addPassword(password: string): DbConnection {
        return this.addProperty('password', password);
    }

    public addHost(host: string): DbConnection {
        return this.addProperty('host', host);
    }

    public addPort(port: number): DbConnection {
        return this.addProperty('port', port);
    }

    public addDatabase(database: string): DbConnection {
        return this.addProperty('database', database);
    }

    public addDefine(define: ModelOptions<Model>): DbConnection {
        return this.addProperty('define', define);
    }

    public addLogging(
        logging: boolean | ((sql: string, timing?: number) => void)
    ): DbConnection {
        return this.addProperty('logging', logging);
    }

    public create(): DbConnection {
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
        options?: SyncOptions
    ): Promise<boolean> {
        if(this.initialized) {
            return false;
        }
        let result = true;
        Object.values(this.connection.models)
        .map((m: any) => {
            m.prototype.associate();
            return m;
        })
        .map((m: any) => {
            m.init(
                m.prototype.getModelAttributes(), 
                m.prototype.getModelInitOptions(this.connection)
            );
            return m;
        })
        .forEach(async (m: any) => {
            try {
                await m.sync(options)
            }
            catch(err: any) {
                logger(err);
                result = false;
            }
        });
        this.initialized = result;
        return result;
    }
}

/*
export function initModels(sequelize: Sequelize): void {
    Object.values(sequelize.models)
    .map((m: any) => {
        m.prototype.associate();
        return m;
    })
    .forEach((m: any) => m.init(
        m.prototype.getModelAttributes(), 
        m.prototype.getModelInitOptions(sequelize)
    ));
}

export async function syncModels(
    sequelize: Sequelize, 
    options?: SyncOptions
): Promise<void> {
    Object.values(sequelize.models)
    .forEach(async (m: any) => await m.sync(options));
}
*/