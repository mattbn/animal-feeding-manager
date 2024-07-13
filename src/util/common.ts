import { Router } from "express";

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
