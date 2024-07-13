import dotenv from "dotenv";
import { ApplicationHandler } from "./util/handlers/application.handler";
dotenv.config();

(async () => {
    let app = new ApplicationHandler();
    await app.initialize(console.log, [
    ]);
    app.run(Number.parseInt(process.env.API_PORT || '8000'));
})();
