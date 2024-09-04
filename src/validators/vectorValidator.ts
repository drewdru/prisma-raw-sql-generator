import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { isVector } from "../types/vector";

@ValidatorConstraint({ name: "isVector", async: false })
export class VectorValidator implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return isVector(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return "Invalid vector";
  }
}
