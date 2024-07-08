import express from "express";
import routes, { Route } from "./routes";

export function init(port: number, logger: Function) {
    logger('Initializing API...');
    let app = express();

    logger('Initializing routes...');
    routes.forEach((route: Route) => {
        logger(`> Initializing /${route.name}...`);
        app.use(`/${route.name}`, route.router);
    });

    app.listen(port, () => {
        logger(`Listening on port ${port}.`);
    });
}
