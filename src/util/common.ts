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

export type ModelProperties<M extends BaseModel> = Omit<M, keyof BaseModel>;

export function applyEnumFunction(
    enumType: any, 
    fn: (x: number, y: number) => number
) {
    return Object.values(enumType)
    .filter((x: any) => typeof(x) === 'number')
    .reduce((x: number, y: number) => fn(x, y));
}

export function filterEntries(obj: any, filter: (x: [string, any]) => boolean) {
    return Object.fromEntries(
        Object.entries(obj)
        .filter(filter)
    );
}

declare global {
    namespace Express {
        export interface Request {
            result: IResult;
        }
    }
}
