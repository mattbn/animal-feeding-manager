import { CreatedFoodResult, DestroyedFoodResult, FoodAlreadyCreatedErrorResult, FoodNotFoundErrorResult, ReadFoodResult, UpdatedFoodResult } from "../../result/food.result";
import { CreatedOrderResult, DestroyedOrderResult, NotEnoughFoodErrorResult, OrderNotFoundErrorResult, ReadOrderResult, SomeFoodsNotFoundErrorResult, UpdatedOrderResult } from "../../result/order.result";
import { IFactory } from "../common";
import { InvalidInputErrorResult, IResult, ResultType, UnauthenticatedErrorResult, UnauthorizedErrorResult, UnknownErrorResult } from "../result";

export class ResultFactory implements IFactory<ResultType, IResult> {
    private static map: Map<ResultType, any> = new Map([
        [ResultType.Unknown, UnknownErrorResult], 
        [ResultType.InvalidInput, InvalidInputErrorResult], 
        [ResultType.Unauthenticated, UnauthenticatedErrorResult], 
        [ResultType.Unauthorized, UnauthorizedErrorResult], 

        [ResultType.CreatedFood, CreatedFoodResult], 
        [ResultType.ReadFood, ReadFoodResult], 
        [ResultType.UpdatedFood, UpdatedFoodResult], 
        [ResultType.DestroyedFood, DestroyedFoodResult], 
        [ResultType.FoodNotFound, FoodNotFoundErrorResult], 
        [ResultType.FoodAlreadyCreated, FoodAlreadyCreatedErrorResult], 

        [ResultType.CreatedOrder, CreatedOrderResult], 
        [ResultType.ReadOrder, ReadOrderResult], 
        [ResultType.UpdatedOrder, UpdatedOrderResult], 
        [ResultType.DestroyedOrder, DestroyedOrderResult], 
        [ResultType.OrderNotFound, OrderNotFoundErrorResult], 
        [ResultType.NotEnoughFood, NotEnoughFoodErrorResult], 
        [ResultType.SomeFoodsNotFound, SomeFoodsNotFoundErrorResult], 
    ]);

    public generate(type: ResultType): IResult {
        let result = ResultFactory.map.get(type) || UnknownErrorResult;
        return new result();
    }
}

export const resultFactory = new ResultFactory();
