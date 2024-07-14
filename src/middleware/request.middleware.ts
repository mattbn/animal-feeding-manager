import { NextFunction, Request, Response } from "express";

export function filterRequest(requestType: any) {
    return function(req: Request, res: Response, next: NextFunction) {
        let request = new requestType(req.params, req.query, req.body);
        req.params = request.params;
        req.body = request.body;
        req.query = request.query;
        next();
    }
}
