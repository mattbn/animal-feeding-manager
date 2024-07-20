import { BaseRequest } from "../util/request";

export class CreateOrderRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super(
            {}, 
            {}, 
            {
                owner: body.owner, 
                foods: body.foods, 
            }
        );
    }
}

export class ReadOrderRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super(
            {
                id: params.id, 
            }, 
            {
                foods: query.foods, 
                created_from: query.created_from, 
                created_to: query.created_to, 
                updated_from: query.updated_from, 
                updated_to: query.updated_to, 
            }, 
            {}
        );
    }
}

export class UpdateOrderRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super(
            {
                id: params.id, 
            }, 
            {}, 
            {
                status: body.status, 
                msg: body.msg, 
                food: body.food, 
                quantity: body.quantity, 
            }
        );
    }
}

export class LoadOrderRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super(
            {
                id: params.id, 
            }, 
            {}, 
            {
                food: body.food, 
                quantity: body.quantity, 
                user: body.user, 
            }
        );
    }
}
