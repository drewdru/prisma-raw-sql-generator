import { Prisma } from "@prisma/client";
import { TUpsertOptions } from "../../../../types/extensions/sqlMethodsWithCast";
import { getInsertValues, selectToSql } from "./utils";

function calculateUpsertColumns<T>(options: TUpsertOptions<T>): {
  columnsKeys: string[];
  columns: Prisma.Sql;
} {
  let columns: Prisma.Sql;
  let columnsKeys: string[];
  if (Object.hasOwn(options.values as any, "sql")) {
    if (!options.columns) {
      throw new Error("columns is required when values is a string");
    }
    if (Object.hasOwn(options.columns as any, "sql")) {
      columnsKeys = (options.columns as Prisma.Sql).toString().split(",");
      columns = options.columns as Prisma.Sql;
    } else {
      columnsKeys = Object.keys(options.columns || {});
      columns = Prisma.raw(columnsKeys.join(","));
    }
  } else {
    columnsKeys = Object.keys(options.values || {});
    columns = Prisma.raw(columnsKeys.join(","));
  }
  return { columnsKeys, columns };
}

/**
 * Generates a SQL query to create or update a record in a table.
 *
 * @param {object} options - An object containing the following properties:
 * * {Prisma.Sql} options.into - The table to upsert records.
 * * {Prisma.Sql} options.confilct - Provide info on which confilct it should do update.
 * * {string | ToSnakeCaseKeys<T>} [options.values] - The columns to insert. This can either be a string or an object of type `ToSnakeCaseKeys<T>`.
 * * {string | ToUpsertCastType<T>} [options.valuesCast] - The columns to upsert. This can either be a string or an object of type `ToUpsertCastType`.
 * * {string} [options.columns] - Unsafe! this column is requered only if [options.values] has a string type. It needs to set query columns which values are upsert.
 * * {string} [options.returning] - this columns will be returned after upsert. default '*'.
 *
 * @returns {Prisma.Sql} A `Prisma.Sql` object that represents a generated SQL query to upsert data into a table.
 */
export function upsertSql<T>(options: TUpsertOptions<T>): Prisma.Sql {
  const returnColumns = selectToSql(options.returning);
  const { columnsKeys, columns } = calculateUpsertColumns(options);
  const insert = getInsertValues(options.values, options.valuesCast, false);

  const setExcluded = Prisma.raw(
    columnsKeys.map((key) => `${key} = EXCLUDED.${key}`).join(",")
  );

  return Prisma.sql`
INSERT INTO ${options.into} (${columns})
VALUES (${insert})
ON CONFLICT ${options.confilct} DO UPDATE SET ${setExcluded}
RETURNING ${returnColumns}
  `;
}
