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

export class DestroyedOrderResult extends BaseResult {
    public constructor() {
        super(ResultType.DestroyedOrder, 'order destroyed successfully');
    }
}

export class OrderNotFoundErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.OrderNotFound, 'no order was found');
    }
}
