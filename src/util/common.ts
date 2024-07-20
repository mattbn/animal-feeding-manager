import { Router } from "express";
import { IResult } from "./result";
import { InitOptions, Model, ModelAttributes, Sequelize, Transaction } from "sequelize";

export type Awaitable<T> = T | Promise<T>;

export type Logger = (msg: any) => Awaitable<void>;

export type Route = {
    name: string, 
    router: Router, 
};

/**
 * Represents the base interface for Factory types.
 */
export interface IFactory<SelectorT, OutputT> {
    generate(type: SelectorT): OutputT;
}

/**
 * Represents the base class for all models.
 */
export abstract class BaseModel extends Model {
    public abstract getModelAttributes(): ModelAttributes<Model>;
    public abstract getModelInitOptions(sequelize: Sequelize): InitOptions;
    public abstract associate(): void;
}

export type ModelProperties<M extends BaseModel> = Omit<M, keyof BaseModel>;

/**
 * Applies a function to (number-based) enum values.
 * @param enumType - The enum type
 * @param fn - The function that will be called
 * @returns The result of the function call
 */
export function applyEnumFunction(
    enumType: any, 
    fn: (x: number, y: number) => number
) {
    return Object.values(enumType)
    .filter((x: any) => typeof(x) === 'number')
    .reduce((x: number, y: number) => fn(x, y));
}

declare global {
    namespace Express {
        export interface Request {
            result: IResult;
            transaction?: Transaction;
            encondedToken: string;
            caller?: { name: string, role: string };
        }
    }
}
