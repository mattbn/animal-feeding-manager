import { BaseResult, ResultType } from "../util/result";

export class CreatedOrderResult extends BaseResult {
    public constructor() {
        super(ResultType.CreatedOrder, 'order created successfully');
    }
}

export class ReadOrderResult extends BaseResult {
    public constructor() {
        super(ResultType.ReadOrder);
    }
}

export class UpdatedOrderResult extends BaseResult {
    public constructor() {
        super(ResultType.UpdatedOrder, 'order updated successfully');
    }
}

export class OrderNotFoundErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.OrderNotFound, 'no order was found');
    }
}

export class NotEnoughFoodErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.NotEnoughFood, 'not enough food');
    }
}

export class SomeFoodsNotFoundErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.SomeFoodsNotFound, 'one or more foods were not found');
    }
}

export class InactiveOrderErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.InactiveOrder, 'order is completed or failed');
    }
}

export class InvalidLoadedQuantityErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.InvalidLoadedQuantity, 'total food loaded quantity is too low or too high');
    }
}

export class InvalidLoadSequenceErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.InvalidLoadSequence, 'load sequence was not respected');
    }
}

export class DuplicateFoodsErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.DuplicateFoods, 'food list contains duplicates');
    }
}
