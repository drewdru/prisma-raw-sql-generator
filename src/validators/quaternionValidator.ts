import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { isQuaternion } from "../types/vector";

@ValidatorConstraint({ name: "isQuaternion", async: false })
export class QuaternionValidator implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return isQuaternion(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return "Invalid Quaternion";
  }
}
