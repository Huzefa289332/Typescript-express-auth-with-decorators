import { ValidationChain } from "express-validator";
import { MetadataKeys } from "../constants";
import "reflect-metadata";

export function validate(validationChain: ValidationChain[]) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(
      MetadataKeys.validationChain,
      validationChain,
      target,
      key
    );
  };
}
