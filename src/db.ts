import { Model, ModelOptions, Options, Sequelize, SyncOptions, Dialect } from "sequelize";

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

export function initModels(sequelize: Sequelize): void {
}

export function initAssociations(): void {
}

export async function syncModels(options?: SyncOptions): Promise<void> {
}
