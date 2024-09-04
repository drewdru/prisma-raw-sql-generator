import { toCamelCase } from "./caseSwitcher";

/**
 * Returns a new object with all properties of the original object except for those specified in the keys param.
 *
 * @param {object} obj - The original object to omit properties from.
 * @param {Array<string>} keys - An array of property names to omit from the object.
 * @returns {object} A new object with all properties of the original object except for those specified in the keys param.
 */
export const omitObject = <T extends Record<string, any>>(
  obj: T,
  keys: string[]
): Omit<T, keyof typeof keys> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  ) as Omit<T, keyof typeof keys>;
};

/**
 * Returns a new object that contains only the properties of the original object specified in the keys parameter.
 *
 * @param {object} obj - The original object to pick properties from.
 * @param {Array<string>} keys - An array of property names to include in the new object.
 * @returns {object} A new object containing only the properties of the original object specified in the keys parameter.
 */
export const pickObject = (obj: any, keys: string[]) =>
  keys.reduce(
    (result, key) => (key in obj ? { ...result, [key]: obj[key] } : result),
    {}
  );

/**
 * Returns a new object that contains sql cast data.
 *
 * @param {object} snakeData - The original object to pick properties from.
 * @param {object} castParams - Castom cast patams.
 * @param {string} defaultCast - toCamelCase - to select keys as camel case, toFalse - to exclude key by default, toTrue - to include key by default
 * @returns {object} A new object containing only the properties to cast original object for raw sql.
 */
export const sqlTypeCast = (snakeData, castParams, defaultCast = "toTrue") => {
  return Object.fromEntries(
    Object.entries(snakeData).map(([key]) => {
      if (castParams[key] !== undefined) {
        return [key, castParams[key]];
      }
      if (defaultCast === "toCamelCase") {
        return [key, `AS "${toCamelCase(key)}"`];
      }
      if (defaultCast === "toFalse") {
        return [key, false];
      }
      return [key, true];
    })
  );
};
