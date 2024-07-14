import { BaseResult, ResultType } from "../util/result";

export class CreatedFoodResult extends BaseResult {
    public constructor() {
        super(ResultType.CreatedFood, 'food created successfully');
    }
}

export class ReadFoodResult extends BaseResult {
    public constructor() {
        super(ResultType.ReadFood);
    }
}

export class UpdatedFoodResult extends BaseResult {
    public constructor() {
        super(ResultType.UpdatedFood, 'food updated successfully');
    }
}

export class DestroyedFoodResult extends BaseResult {
    public constructor() {
        super(ResultType.DestroyedFood, 'food destroyed successfully');
    }
}

export class FoodNotFoundErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.FoodNotFound, 'no food was found');
    }
}

export class FoodAlreadyCreatedErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.FoodAlreadyCreated, 'food already present');
    }
}
