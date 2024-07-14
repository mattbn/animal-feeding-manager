
export interface IRequest {
    params: any;
    query: any;
    body: any;
}

export class BaseRequest implements IRequest {
    params: any;
    query: any;
    body: any;

    private static keepDefinedValues(obj: any) {
        return Object.fromEntries(
            Object.entries(obj)
            .filter((x: [string, unknown]) => obj[x[0]] !== undefined)
        );
    }

    protected constructor(params: any, query: any, body: any) {
        this.params = BaseRequest.keepDefinedValues(params);
        this.query = BaseRequest.keepDefinedValues(query);
        this.body = BaseRequest.keepDefinedValues(body);
    }
}
