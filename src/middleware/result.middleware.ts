import { NextFunction, Request, Response } from "express";
import { HttpResultDecorator, ResultType } from "../util/result";
import { resultFactory } from "../util/factory/result.factory";
import { Logger } from "../util/common";
import { StatusCodes } from "http-status-codes";

export function handleError(logger: Logger) {
    return function(err: any, req: Request, res: Response, next: NextFunction) {
        let type: ResultType = ResultType.Unknown;
        if(err in ResultType) {
            type = err;
        }
        else {
            logger(err);
        }
        req.result = resultFactory
        .generate(type);
        next();
    }
}

export function sendResult(req: Request, res: Response) {
    if(req.result) {
        let result = new HttpResultDecorator(req.result);
        let data = result.getData();
        if(result.getMsg()) {
            data = {
                msg: result.getMsg(), 
                data: data, 
            };
        }
        res.status(result.getCode())
        .send(data);
    }
    else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export function result(logger: Logger) {
    return [
        handleError(logger), 
        sendResult, 
    ];
}
