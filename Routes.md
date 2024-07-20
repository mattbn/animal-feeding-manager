
# Additional route information
The following is the complete list of routes that the application can handle, each one with its request argument format/types and possible response and their meaning.

## Generic

### GET /healthcheck

Request arguments:
- Parameters: `-`
- Query: `-`
- Body: `-`

Possible responses:
- Status code 200 - OK: application is running.

## Foods

### GET /foods

Request arguments:
- Parameters: `-`
- Query: `-`
- Body: `-`

Possible responses:
- FoodNotFound: the `Foods` table is empty.
- ReadFood: one or more `Food` where found.

### POST /foods

Request arguments:
- Parameters: `-`
- Query: `-`
- Body: ```{
    name: string, 
    quantity: number
}```

Possible responses:
- Unauthenticated: authorization header was not provided or it's invalid.
- Unauthorized: the caller does not have the required roles.
- InvalidInput: invalid request format.
- FoodAlreadyPresent: the provided food is already in the database.
- CreatedFood: a new `Food` was created.

### GET /foods/:id

Request arguments:
- Parameters: ```{
    id: bigint
}```
- Query: `-`
- Body: `-`

Possible responses:
- InvalidInput: invalid request format.
- FoodNotFound: the requested `Food` was not found.
- ReadFood: the requested `Food` was found.

### PUT /foods/:id

Request arguments:
- Parameters: ```{
    id: bigint
}```
- Query: `-`
- Body: ```{
    quantity: number
}```

Possible responses:
- Unauthenticated: authorization header was not provided or it's invalid.
- Unauthorized: the caller does not have the required roles.
- InvalidInput: invalid request format.
- FoodNotFound: the requested `Food` was not found.
- Unknown: unknown error.
- UpdatedFood: the requested `Food` was updated.

### GET /foods/:id/events

Request arguments:
- Parameters: ```{
    id: bigint
}```
- Query: ```{
    from: Date, 
    to: Date, 
}```
- Body: `-`

Possible responses:
- Unauthenticated: authorization header was not provided or it's invalid.
- Unauthorized: the caller does not have the required roles.
- InvalidInput: invalid request format.
- FoodNotFound: the requested `Food` was not found.
- Unknown: unknown error.
- ReadFoodEvents: the `Events` associated with the requested `Food` were found.

## Orders

### GET /orders

Request arguments:
- Parameters: `-`
- Query: ```{
    created_from: Date, 
    created_to: Date, 
    updated_from: Date, 
    updated_to: Date, 
    foods: bigint[]
}```
- Body: `-`

Possible responses:
- OrderNotFound: the `Orders` table is empty.
- Unknown: unknown error.
- ReadOrder: one or more `Order` were found.

### POST /orders

Request arguments:
- Parameters: `-`
- Query: `-`
- Body: ```{
    foods: { id: bigint, quantity: number }[]
}```

Possible responses:
- Unauthenticated: authorization header was not provided or it's invalid.
- Unauthorized: the caller does not have the required roles.
- InvalidInput: invalid request format.
- DuplicateFoods: there are one or more duplicate foods in the order list.
- FoodNotFound: one or more foods do not exist in the `Foods` table.
- NotEnoughFood: the required quantity for one or more foods exceeds the available quantity.
- Unknown: unknown error.
- CreatedOrder: a new `Order` was created.

### GET /orders/:id

Request arguments:
- Parameters: ```{
    id: bigint
}```
- Query: `-`
- Body: `-`

Possible responses:
- Unauthenticated: authorization header was not provided or it's invalid.
- Unauthorized: the caller does not have the required roles.
- InvalidInput: invalid request format.
- OrderNotFound: the requested `Order` was not found.
- ReadOrder: the requested `Order` was found.

### POST /orders/:id/load

Request arguments:
- Parameters: ```{
    id: bigint
}```
- Query: `-`
- Body: ```{
    food: bigint, 
    quantity: number
}```

Possible responses:
- Unauthenticated: authorization header was not provided or it's invalid.
- Unauthorized: the caller does not have the required roles.
- InvalidInput: invalid request format.
- OrderNotFound: the requested `Order` was not found.
- InactiveOrder: the requested `Order` is either `Completed` or `Failed`.
- NotEnoughFood: the loaded quantity exceeds the available quantity.
- InvalidLoadSequence: the load sequence for this order was not respected.
- InvalidLoadedQuantity: the loaded quantity is less than N % of the required quantity, where N is an environment variable.
- Unknown: unknown error.
- UpdatedOrder: the requested `Order` was updated.

### GET /orders/:id/info

Request arguments:
- Parameters: ```{
    id: bigint
}```
- Query: `-`
- Body: `-`

Possible responses:
- Unauthenticated: authorization header was not provided or it's invalid.
- Unauthorized: the caller does not have the required roles.
- InvalidInput: invalid request format.
- OrderNotFound: the requested `Order` was not found.
- Unknown: unknown error.
- ReadOrder: the requested `Order` was found.
