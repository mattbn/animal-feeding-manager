import { CreatedFoodResult, FoodAlreadyCreatedErrorResult, FoodNotFoundErrorResult, ReadFoodResult, UpdatedFoodResult } from "../../result/food.result";
import { CreatedOrderResult, InactiveOrderErrorResult, NotEnoughFoodErrorResult, OrderNotFoundErrorResult, ReadOrderResult, SomeFoodsNotFoundErrorResult, UpdatedOrderResult } from "../../result/order.result";
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
        [ResultType.FoodNotFound, FoodNotFoundErrorResult], 
        [ResultType.FoodAlreadyCreated, FoodAlreadyCreatedErrorResult], 

        [ResultType.CreatedOrder, CreatedOrderResult], 
        [ResultType.ReadOrder, ReadOrderResult], 
        [ResultType.UpdatedOrder, UpdatedOrderResult], 
        [ResultType.OrderNotFound, OrderNotFoundErrorResult], 
        [ResultType.NotEnoughFood, NotEnoughFoodErrorResult], 
        [ResultType.SomeFoodsNotFound, SomeFoodsNotFoundErrorResult], 
        [ResultType.InactiveOrder, InactiveOrderErrorResult], 
    ]);

    public generate(type: ResultType): IResult {
        let result = ResultFactory.map.get(type) || UnknownErrorResult;
        return new result();
    }
}

export const resultFactory = new ResultFactory();
