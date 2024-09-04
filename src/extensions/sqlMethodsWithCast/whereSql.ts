import { Prisma } from "@prisma/client";
import { isUUID } from "class-validator";
import { isEmbendding, isQuaternion, isVector } from "../../types/vector";
import { toSnakeCaseKeys } from "../../utils/caseSwitcher";

export const whereSql = (
  where: Record<string, any>,
  operator: "AND" | "OR" = "AND"
) => {
  const data = toSnakeCaseKeys(where);
  const conditions = Object.entries(data).map(([key, value]) => {
    const column = Prisma.sql([`${key}`]);
    if (value === undefined || key.includes("_distance_filter")) {
      return null;
    } else if (isVector(value) || isQuaternion(value) || isEmbendding(value)) {
      if (data[`${key}_distance_filter`]) {
        return Prisma.sql`${column} <-> ${`[${value.join(",")}]`}::vector <= ${
          data[`${key}_distance_filter`]
        }`;
      }
      return Prisma.sql`${column} = ${`[${value.join(",")}]`}::vector`;
    } else if (typeof value === "string") {
      if (isUUID(value)) {
        return Prisma.sql`${column} = ${value}::uuid`;
      }
      const like = `%${value}%`;
      return Prisma.sql`${column} ILIKE ${like}`;
    } else if (typeof value === "number") {
      return Prisma.sql`${column} = ${value}`;
    } else if (Array.isArray(value)) {
      return Prisma.sql`${column} IN (${Prisma.join(value)})`;
    }
    return Prisma.sql`${column} = ${value}`;
  });

  return Prisma.join(
    conditions.filter((item) => item !== null),
    ` ${operator} `
  );
};
