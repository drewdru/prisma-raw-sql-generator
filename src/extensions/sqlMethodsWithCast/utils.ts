import { Prisma } from "@prisma/client";
import {
  ToInsertCastType,
  ToSelectCastType,
  ToSnakeCaseKeys,
} from "../../../../types/extensions/sqlMethodsWithCast";
import { isEmbendding, isQuaternion, isVector } from "../../../../types/vector";

export function selectToSql<T>(select?: ToSelectCastType<T> | Prisma.Sql) {
  let selectColumns: Prisma.Sql;
  if (Object.hasOwn(select, "sql")) {
    selectColumns = select as Prisma.Sql;
  } else if (select) {
    const selectedColumns = Object.keys(select || {});
    const selectedCastedColumns = selectedColumns.map((column) => {
      const castType = select[column] === true ? "" : `${select[column]}`;
      const formattedCastType = castType.startsWith("::")
        ? castType
        : ` ${castType}`;
      return `${column}${formattedCastType}`;
    });
    const joinedSelectedCastedColumns = selectedCastedColumns.join(",");
    selectColumns = Prisma.raw(joinedSelectedCastedColumns);
  } else {
    selectColumns = Prisma.sql`*`;
  }
  return selectColumns;
}

export function getInsertValues<T>(
  data: ToSnakeCaseKeys<T> | Prisma.Sql,
  cast: ToInsertCastType<T>,
  isCastToKey = true
): Prisma.Sql {
  if (Object.hasOwn(data as any, "sql")) {
    return data as Prisma.Sql;
  }
  const valueEntries = Object.entries(cast)
    .filter(
      ([key]) =>
        data[key] !== undefined && data[key] !== null && data[key] !== ""
    )
    .map(([key, value]) => {
      const itemValue = data[key];
      if (typeof value === "string") {
        if (
          isVector(itemValue) ||
          isQuaternion(itemValue) ||
          isEmbendding(itemValue)
        ) {
          return Prisma.sql`${`[${itemValue.join(",")}]`}${Prisma.raw(value)} ${
            isCastToKey ? Prisma.sql`AS "${key}"` : Prisma.empty
          }`;
        }
        return Prisma.sql`${itemValue}${Prisma.raw(value)} ${
          isCastToKey ? Prisma.sql`AS "${key}"` : Prisma.empty
        }`;
      }
      return Prisma.sql`${itemValue} ${
        isCastToKey ? Prisma.sql`AS "${key}"` : Prisma.empty
      }`;
    });
  return Prisma.sql`${Prisma.join(valueEntries, ",")}`;
}

export function getUpdateValues<T>(
  data: ToSnakeCaseKeys<T> | Prisma.Sql,
  cast: ToInsertCastType<T>
): Prisma.Sql {
  if (Object.hasOwn(data as any, "sql")) {
    return data as Prisma.Sql;
  }
  const valueEntries = Object.entries(cast)
    .filter(
      ([key]) =>
        data[key] !== undefined && data[key] !== null && data[key] !== ""
    )
    .map(([key, value]) => {
      const itemValue = data[key];
      if (typeof value === "string") {
        if (
          isVector(itemValue) ||
          isQuaternion(itemValue) ||
          isEmbendding(itemValue)
        ) {
          return Prisma.sql`${`[${itemValue.join(",")}]`}${Prisma.raw(
            value
          )} AS "${key}"`;
        }
        return Prisma.sql`${itemValue}${Prisma.raw(value)} AS "${key}"`;
      }
      return Prisma.sql`${itemValue} AS "${key}"`;
    });
  return Prisma.sql`${Prisma.join(valueEntries, ",")}`;
}
