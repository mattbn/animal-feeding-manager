import { StatusCodes } from "http-status-codes";

export enum ResultType {
    InvalidInput, 
    Unauthenticated, 
    Unauthorized, 
    FoodNotFound, 
    FoodAlreadyCreated, 
    OrderNotFound, 
    NotEnoughFood, 
    SomeFoodsNotFound, 
    InactiveOrder, 
    InvalidLoadedQuantity, 
    InvalidLoadSequence, 
    DuplicateFoods, 
    Unknown, 

    CreatedFood, 
    ReadFood, 
    UpdatedFood,
    ReadFoodEvents, 

    CreatedOrder, 
    ReadOrder, 
    UpdatedOrder, 
}

export function isErrorResult(result: ResultType): boolean {
    return result <= ResultType.Unknown;
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
        [ResultType.FoodNotFound, StatusCodes.NOT_FOUND], 
        [ResultType.FoodAlreadyCreated, StatusCodes.BAD_REQUEST], 

        [ResultType.CreatedOrder, StatusCodes.CREATED], 
        [ResultType.ReadOrder, StatusCodes.OK], 
        [ResultType.UpdatedOrder, StatusCodes.OK], 
        [ResultType.OrderNotFound, StatusCodes.NOT_FOUND], 
        [ResultType.NotEnoughFood, StatusCodes.BAD_REQUEST], 
        [ResultType.SomeFoodsNotFound, StatusCodes.NOT_FOUND], 
        [ResultType.InactiveOrder, StatusCodes.BAD_REQUEST], 
        [ResultType.InvalidLoadSequence, StatusCodes.BAD_REQUEST], 
        [ResultType.InvalidLoadedQuantity, StatusCodes.BAD_REQUEST], 
        [ResultType.DuplicateFoods, StatusCodes.BAD_REQUEST], 
        [ResultType.ReadFoodEvents, StatusCodes.OK], 
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
