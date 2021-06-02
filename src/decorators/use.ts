import { RequestHandler } from "express";
import { MetadataKeys } from "../constants";
import "reflect-metadata";

export function use(middleware: RequestHandler) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const middlewares =
      Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];

    Reflect.defineMetadata(
      MetadataKeys.middleware,
      [middleware, ...middlewares],
      target,
      key
    );
  };
}
