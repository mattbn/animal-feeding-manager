import { CreatedFoodResult, FoodAlreadyCreatedErrorResult, FoodNotFoundErrorResult, ReadFoodEventsResult, ReadFoodResult, UpdatedFoodResult } from "../../result/food.result";
import { CreatedOrderResult, DuplicateFoodsErrorResult, InactiveOrderErrorResult, InvalidLoadedQuantityErrorResult, InvalidLoadSequenceErrorResult, NotEnoughFoodErrorResult, OrderNotFoundErrorResult, ReadOrderResult, SomeFoodsNotFoundErrorResult, UpdatedOrderResult } from "../../result/order.result";
import { IFactory } from "../common";
import { InvalidInputErrorResult, IResult, ResultType, UnauthenticatedErrorResult, UnauthorizedErrorResult, UnknownErrorResult } from "../result";

/**
 * A factory that generates every possible IResult.
 */
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
        [ResultType.InvalidLoadSequence, InvalidLoadSequenceErrorResult], 
        [ResultType.InvalidLoadedQuantity, InvalidLoadedQuantityErrorResult], 
        [ResultType.DuplicateFoods, DuplicateFoodsErrorResult], 
        [ResultType.ReadFoodEvents, ReadFoodEventsResult], 
    ]);

    /**
     * Generates a new IResult.
     * @param type - The type of result that should be generated
     * @returns An IResult instance
     */
    public generate(type: ResultType): IResult {
        let result = ResultFactory.map.get(type) || UnknownErrorResult;
        return new result();
    }
}

export const resultFactory = new ResultFactory();
