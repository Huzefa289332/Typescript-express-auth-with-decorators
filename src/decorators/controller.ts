import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { AppRouter } from "../router/AppRouter";
import { Methods, MetadataKeys } from "../constants";
import { RequestValidationError } from "../errors";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};

export function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getInstance();

    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];

      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );

      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );

      const middlewares =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];

      const validationChain: ValidationChain[] =
        Reflect.getMetadata(
          MetadataKeys.validationChain,
          target.prototype,
          key
        ) || [];

      if (path) {
        router[method](
          `${routePrefix}${path}`,
          ...validationChain,
          validateRequest,
          ...middlewares,
          routeHandler
        );
      }
    }
  };
}
