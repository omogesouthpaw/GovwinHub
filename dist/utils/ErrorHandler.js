"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientPaymentException = exports.EmptyCartException = exports.CartExpiredException = exports.CartNotFoundException = exports.InsufficientStockException = exports.ProductUnavailableException = exports.ProductNotFoundException = void 0;
class ErrorHandler extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorHandler;
class ProductNotFoundException extends Error {
    constructor(productId) {
        super(`Product with ID ${productId} not found`);
        this.name = 'ProductNotFoundException';
    }
}
exports.ProductNotFoundException = ProductNotFoundException;
class ProductUnavailableException extends Error {
    constructor(productName) {
        super(`Product ${productName} is currently unavailable`);
        this.name = 'ProductUnavailableException';
    }
}
exports.ProductUnavailableException = ProductUnavailableException;
class InsufficientStockException extends Error {
    constructor(productName, available, requested) {
        super(`Insufficient stock for ${productName}. Available: ${available}, Requested: ${requested}`);
        this.name = 'InsufficientStockException';
    }
}
exports.InsufficientStockException = InsufficientStockException;
class CartNotFoundException extends Error {
    constructor(cartId) {
        super(`Cart with ID ${cartId} not found`);
        this.name = 'CartNotFoundException';
    }
}
exports.CartNotFoundException = CartNotFoundException;
class CartExpiredException extends Error {
    constructor(cartId) {
        super(`Cart with ID ${cartId} has expired`);
        this.name = 'CartExpiredException';
    }
}
exports.CartExpiredException = CartExpiredException;
class EmptyCartException extends Error {
    constructor() {
        super('Cannot checkout an empty cart');
        this.name = 'EmptyCartException';
    }
}
exports.EmptyCartException = EmptyCartException;
class InsufficientPaymentException extends Error {
    constructor(total, tendered) {
        super(`Insufficient payment. Total: $${total.toFixed(2)}, Tendered: $${tendered.toFixed(2)}`);
        this.name = 'InsufficientPaymentException';
    }
}
exports.InsufficientPaymentException = InsufficientPaymentException;
//# sourceMappingURL=ErrorHandler.js.map