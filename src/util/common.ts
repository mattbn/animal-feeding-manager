import { Router } from "express";
import { IResult } from "./result";
import { InitOptions, Model, ModelAttributes, Sequelize } from "sequelize";

export type Awaitable<T> = T | Promise<T>;

export type Logger = (msg: any) => Awaitable<void>;

export interface IHandler {
    initialize(logger: Logger, ...args: any[]): Awaitable<boolean>;
    isInitialized(): boolean;
}

export type Route = {
    name: string, 
    router: Router, 
};

export interface IFactory<SelectorT, OutputT> {
    generate(type: SelectorT): OutputT;
}

export abstract class BaseModel extends Model {
    public abstract getModelAttributes(): ModelAttributes<Model>;
    public abstract getModelInitOptions(sequelize: Sequelize): InitOptions;
    public abstract associate(): void;
}

declare global {
    namespace Express {
        export interface Request {
            result: IResult;
        }
    }
}
