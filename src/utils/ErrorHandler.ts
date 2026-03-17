export default class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ProductNotFoundException extends Error {
  constructor(productId: string) {
    super(`Product with ID ${productId} not found`);
    this.name = 'ProductNotFoundException';
  }
}

export class ProductUnavailableException extends Error {
  constructor(productName: string) {
    super(`Product ${productName} is currently unavailable`);
    this.name = 'ProductUnavailableException';
  }
}

export class InsufficientStockException extends Error {
  constructor(productName: string, available: number, requested: number) {
    super(`Insufficient stock for ${productName}. Available: ${available}, Requested: ${requested}`);
    this.name = 'InsufficientStockException';
  }
}

export class CartNotFoundException extends Error {
  constructor(cartId: string) {
    super(`Cart with ID ${cartId} not found`);
    this.name = 'CartNotFoundException';
  }
}

export class CartExpiredException extends Error {
  constructor(cartId: string) {
    super(`Cart with ID ${cartId} has expired`);
    this.name = 'CartExpiredException';
  }
}

export class EmptyCartException extends Error {
  constructor() {
    super('Cannot checkout an empty cart');
    this.name = 'EmptyCartException';
  }
}

export class InsufficientPaymentException extends Error {
  constructor(total: number, tendered: number) {
    super(`Insufficient payment. Total: $${total.toFixed(2)}, Tendered: $${tendered.toFixed(2)}`);
    this.name = 'InsufficientPaymentException';
  }
}
