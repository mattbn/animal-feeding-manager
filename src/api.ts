import dotenv from "dotenv";
import { ApplicationHandler } from "./util/handlers/application.handler";
import { json, Router } from "express";
import { result } from "./middleware/result.middleware";
import { FoodController } from "./controller/food.controller";
import { OrderController } from "./controller/order.controller";
import { validateQuery } from "./middleware/order.middleware";
import { CreateFoodRequest, DestroyFoodRequest, ReadFoodRequest, UpdateFoodRequest } from "./request/food.request";
import { filterRequest } from "./middleware/request.middleware";
import { CreateOrderRequest, DestroyOrderRequest, ReadOrderRequest, UpdateOrderRequest } from "./request/order.request";
dotenv.config();

(async () => {
    let app = new ApplicationHandler();
    await app.initialize(console.log, [
        {
            name: 'foods', 
            router: Router()
                .use(json())
                .get('/', filterRequest(ReadFoodRequest), FoodController.read)
                .post('/', filterRequest(CreateFoodRequest), FoodController.create)
                .put('/', filterRequest(UpdateFoodRequest), FoodController.update)
                .get('/:id', filterRequest(ReadFoodRequest), FoodController.read)
                .put('/:id', filterRequest(UpdateFoodRequest), FoodController.update)
                .delete('/:id', filterRequest(DestroyFoodRequest), FoodController.destroy)
                .use(result(console.log))
        }, 
        {
            name: 'orders', 
            router: Router()
                .use(json())
                .get('/', filterRequest(ReadOrderRequest), validateQuery, OrderController.read)
                .post('/', filterRequest(CreateOrderRequest), OrderController.create)
                .get('/:id', filterRequest(ReadOrderRequest), OrderController.read)
                .put('/:id', filterRequest(UpdateOrderRequest), OrderController.update)
                .delete('/:id', filterRequest(DestroyOrderRequest), OrderController.destroy)
                .use(result(console.log))
        }
    ]);
    app.run(Number.parseInt(process.env.API_PORT || '8000'));
})();
