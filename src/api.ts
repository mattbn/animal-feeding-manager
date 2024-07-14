import dotenv from "dotenv";
import { ApplicationHandler } from "./util/handlers/application.handler";
import { json, Router } from "express";
import { result } from "./middleware/result.middleware";
import { FoodController } from "./controller/food.controller";
import { OrderController } from "./controller/order.controller";
import { validateQuery } from "./middleware/order.middleware";
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
        {
            name: 'orders', 
            router: Router()
                .use(json())
                .get('/', validateQuery, OrderController.read)
                .post('/', OrderController.create)
                .get('/:id', OrderController.read)
                .put('/:id', OrderController.update)
                .delete('/:id', OrderController.destroy)
                .use(result(console.log))
        }
    ]);
    app.run(Number.parseInt(process.env.API_PORT || '8000'));
})();
