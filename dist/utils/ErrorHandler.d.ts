export default class ErrorHandler extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class ProductNotFoundException extends Error {
    constructor(productId: string);
}
export declare class ProductUnavailableException extends Error {
    constructor(productName: string);
}
export declare class InsufficientStockException extends Error {
    constructor(productName: string, available: number, requested: number);
}
export declare class CartNotFoundException extends Error {
    constructor(cartId: string);
}
export declare class CartExpiredException extends Error {
    constructor(cartId: string);
}
export declare class EmptyCartException extends Error {
    constructor();
}
export declare class InsufficientPaymentException extends Error {
    constructor(total: number, tendered: number);
}
