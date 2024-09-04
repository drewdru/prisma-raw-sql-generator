import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { isEmbendding } from "../types/vector";

@ValidatorConstraint({ name: "isEmbendding", async: false })
export class EmbenddingValidator implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return isEmbendding(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return "Invalid embendding";
  }
}
