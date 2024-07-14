
export interface IRequest {
    params: any;
    query: any;
    body: any;
}

export class BaseRequest implements IRequest {
    params: any;
    query: any;
    body: any;

    protected constructor(params: any, query: any, body: any) {
        this.params = params;
        this.query = query;
        this.body = body;
    }
}
