import "reflect-metadata";
import { ValidationChain } from "express-validator";
import { AppRouter } from "../Router/AppRouter";
import { Methods, MetadataKeys } from "../constants";

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
          ...middlewares,
          routeHandler
        );
      }
    }
  };
}
