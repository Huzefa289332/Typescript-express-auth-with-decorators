import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  statusCode = 404;
  message: string = "Not Found";

  constructor(message?: string) {
    super("Route not found");
    if (message) this.message = message;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
