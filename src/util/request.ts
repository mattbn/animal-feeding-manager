
/**
 * Base interface for request parameter validation.
 */
export interface IRequest {
    params: any;
    query: any;
    body: any;
}

/**
 * Base class for request parameter validation.
 */
export class BaseRequest implements IRequest {
    params: any;
    query: any;
    body: any;

    public static keepDefinedValues(obj: any) {
        return Object.fromEntries(
            Object.entries(obj)
            .filter((x: [string, unknown]) => obj[x[0]] !== undefined)
        );
    }

    protected constructor(params: any, query: any, body: any) {
        this.params = params;
        this.query = query;
        this.body = body;
    }
}

/**
 * An empty request.
 */
export class NullRequest extends BaseRequest {
    public constructor(params: any, query: any, body: any) {
        super({}, query, {});
    }
}
