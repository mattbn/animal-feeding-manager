import dotenv from "dotenv";
import { ApplicationHandler } from "./util/handlers/application.handler";
import { json, Router } from "express";
import { result } from "./middleware/result.middleware";
import { FoodController } from "./controller/food.controller";
dotenv.config();

(async () => {
    let app = new ApplicationHandler();
    await app.initialize(console.log, [
        {
            name: 'foods', 
            router: Router()
                .use(json())
                .get('/', FoodController.read)
                .post('/', FoodController.create)
                .get('/:id', FoodController.read)
                .put('/:id', FoodController.update)
                .delete('/:id', FoodController.destroy)
                .use(result(console.log))
        }, 
    ]);
    app.run(Number.parseInt(process.env.API_PORT || '8000'));
})();
