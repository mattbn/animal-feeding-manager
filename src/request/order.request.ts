import { OrderStatus } from "../model/order.model";
import { BaseRequest } from "../util/request";

export class CreateOrderRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super({
        }, {
        }, {
            owner: body.owner, 
            foods: body.foods, // { id: bigint, quantity: number }[]
        });
    }
}

export class ReadOrderRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super({
            id: params.id, 
        }, {
            foods: query.foods, 
            created_from: query.created_from, 
            created_to: query.created_to, 
            updated_from: query.updated_from, 
            updated_to: query.updated_to, 
        }, {
        });
    }
}

export class UpdateOrderRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super({
            id: params.id, 
        }, {
        }, {
            status: body.status, 
            msg: body.msg, 
        });
    }
}

export class DestroyOrderRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super({
            id: params.id, 
        }, {
        }, {
        });
    }
}
