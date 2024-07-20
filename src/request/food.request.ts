import { BaseRequest } from "../util/request";

export class CreateFoodRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super(
            {}, 
            {}, 
            {
                name: body.name, 
                quantity: body.quantity
            }
        );
    }
}

export class ReadFoodRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super(
            {
                id: params.id, 
            }, 
            {}, 
            {}
        );
    }
}

export class UpdateFoodRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super(
            {
                id: params.id, 
            }, 
            {}, 
            {
                quantity: body.quantity, 
            }
        )
    }
}
