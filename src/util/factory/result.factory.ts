import { CreatedFoodResult, DestroyedFoodResult, FoodNotFoundErrorResult, ReadFoodResult, UpdatedFoodResult } from "../../result/food.result";
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
        [ResultType.FoodNotFound, FoodNotFoundErrorResult]
    ]);

    public generate(type: ResultType): IResult {
        let result = ResultFactory.map.get(type) || UnknownErrorResult;
        return new result();
    }
}

export const resultFactory = new ResultFactory();
