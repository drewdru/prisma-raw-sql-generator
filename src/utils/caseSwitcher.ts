import { ToSnakeCaseKeys, ToCamelCaseKeys } from "../types/sqlMethodsWithCast";

export const toSnakeCase = (key: string): string => {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const toSnakeCaseKeys = <T>(obj: T): ToSnakeCaseKeys<T> => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Float32Array)
    ) {
      result[toSnakeCase(key)] = toSnakeCaseKeys(value);
    } else {
      result[toSnakeCase(key)] = value;
    }
  }
  return result as ToSnakeCaseKeys<T>;
};

export const toCamelCase = (key: string): string => {
  return key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

export const toCamelCaseKeys = <T>(obj: T): ToCamelCaseKeys<T> => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Float32Array)
    ) {
      result[toCamelCase(key)] = toCamelCaseKeys(value);
    } else {
      result[toCamelCase(key)] = value;
    }
  }
  return result as ToCamelCaseKeys<T>;
};
