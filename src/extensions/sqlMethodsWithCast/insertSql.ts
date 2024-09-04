import { Prisma } from "@prisma/client";
import { TInsertOptions } from "../../../../types/extensions/sqlMethodsWithCast";
import { getInsertValues, selectToSql } from "./utils";

function calculateInsertColumns<T>(options: TInsertOptions<T>): Prisma.Sql {
  let columns: Prisma.Sql;
  if (Object.hasOwn(options.values as any, "sql")) {
    if (!options.columns) {
      throw new Error("columns is required when values is a string");
    }
    if (Object.hasOwn(options.columns as any, "sql")) {
      columns = options.columns as Prisma.Sql;
    } else {
      const columnsKeys = Object.keys(options.columns || {});
      columns = Prisma.raw(columnsKeys.join(","));
    }
  } else {
    const columnsKeys = Object.keys(options.values || {});
    columns = Prisma.raw(columnsKeys.join(","));
  }
  return columns;
}

/**
 * Generates a SQL query to create a record in a table.
 *
 * @param {object} options - An object containing the following properties:
 * * {Prisma.Sql} options.into - The table to instert records.
 * * {string | ToSnakeCaseKeys<T>} [options.values] - The columns to insert. This can either be a string or an object of type `ToSnakeCaseKeys<T>`.
 * * {string | ToInsertCastType<T>} [options.valuesCast] - The columns to insert. This can either be a string or an object of type `ToInsertCastType`.
 * * {string} [options.columns] - Unsafe! This column is requered only if [options.values] has a string type. It needs to set query columns which values are insert.
 * * {string} [options.returning] - this columns will be returned after insert if provided.
 *
 * @returns {Prisma.Sql} A `Prisma.Sql` object that represents a generated SQL query to insert data into a table.
 */
export function insertSql<T>(options: TInsertOptions<T>): Prisma.Sql {
  const returnColumns = options.returning
    ? Prisma.sql`RETURNING ${selectToSql(options.returning)}`
    : Prisma.empty;
  const columns = calculateInsertColumns(options);
  const insert = getInsertValues(options.values, options.valuesCast);
  return Prisma.sql`
INSERT INTO ${options.into} (
  ${columns}
) VALUES (
  ${insert}
)
${returnColumns}
  `;
}

// BULK INSERT
// INSERT INTO ${options.into} (${columns})
// VALUES unnest(${array}::jsonb[]) arr(${columnsCasted});
