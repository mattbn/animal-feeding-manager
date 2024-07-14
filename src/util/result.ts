import { StatusCodes } from "http-status-codes";

export enum ResultType {
    Unknown, 
    InvalidInput, 
    Unauthenticated, 
    Unauthorized, 

    CreatedFood, 
    ReadFood, 
    UpdatedFood,
    DestroyedFood, 
    FoodNotFound, 

    CreatedOrder, 
    ReadOrder, 
    UpdatedOrder, 
    DestroyedOrder, 
    OrderNotFound, 
}

export interface IResult {
    getType(): ResultType;
    getMsg(): string | undefined;
    setMsg(msg: string): IResult;
    getData(): any;
    setData(data: any): IResult;
}

export class BaseResult implements IResult {
    private type: ResultType;
    private data: any;
    private msg?: string;

    protected constructor(type: ResultType, msg?: string, data?: any) {
        this.type = type;
        this.msg = msg;
        this.data = data;
    }

    public getType(): ResultType {
        return this.type;
    }

    public getData(): any {
        return this.data;
    }

    public getMsg(): string | undefined {
        return this.msg;
    }

    public setData(data: any): IResult {
        this.data = data;
        return this;
    }

    public setMsg(msg: string): IResult {
        this.msg = msg;
        return this;
    }
}

export class UnknownErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.Unknown, 'unknown error');
    }
}

export class InvalidInputErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.InvalidInput, 'invalid input');
    }
}

export class UnauthenticatedErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.Unauthenticated, 'unauthenticated');
    }
}

export class UnauthorizedErrorResult extends BaseResult {
    public constructor() {
        super(ResultType.Unauthorized, 'unauthorized');
    }
}

// decorator
export class HttpResultDecorator extends BaseResult {
    private static map: Map<ResultType, StatusCodes> = new Map([
        [ResultType.Unknown, StatusCodes.INTERNAL_SERVER_ERROR], 
        [ResultType.InvalidInput, StatusCodes.BAD_REQUEST], 
        [ResultType.Unauthenticated, StatusCodes.UNAUTHORIZED], 
        [ResultType.Unauthorized, StatusCodes.FORBIDDEN], 

        [ResultType.CreatedFood, StatusCodes.CREATED], 
        [ResultType.ReadFood, StatusCodes.OK], 
        [ResultType.UpdatedFood, StatusCodes.OK], 
        [ResultType.DestroyedFood, StatusCodes.OK], 
        [ResultType.FoodNotFound, StatusCodes.NOT_FOUND], 

        [ResultType.CreatedOrder, StatusCodes.CREATED], 
        [ResultType.ReadOrder, StatusCodes.OK], 
        [ResultType.UpdatedOrder, StatusCodes.OK], 
        [ResultType.DestroyedOrder, StatusCodes.OK], 
        [ResultType.OrderNotFound, StatusCodes.NOT_FOUND], 
    ]);
    private code: StatusCodes;

    public constructor(result: IResult) {
        super(result.getType(), result.getMsg(), result.getData());
        this.code = HttpResultDecorator.map.get(result.getType())
        || StatusCodes.INTERNAL_SERVER_ERROR;
    }

    public getCode(): StatusCodes {
        return this.code;
    }
}
