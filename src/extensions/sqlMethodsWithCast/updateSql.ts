import { Prisma } from "@prisma/client";
import { TUpdateOptions } from "../../../../types/extensions/sqlMethodsWithCast";
import { getInsertValues, getUpdateValues, selectToSql } from "./utils";

function calculateUpdateColumns<T>(options: TUpdateOptions<T>): Prisma.Sql {
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
    if (!options.valuesCast) {
      throw new Error("valuesCast is required when values is an object");
    }
    const columnsKeys = Object.keys(options.values || {}).filter(
      (item) => !!options.valuesCast[item]
    );
    columns = Prisma.raw(columnsKeys.join(","));
  }
  return columns;
}

/**
 * Generates a SQL query to create or update a record in a table.
 *
 * @param {object} options - An object containing the following properties:
 * * {Prisma.Sql} options.table - The table to update records.
 * * {string | ToSnakeCaseKeys<T>} [options.values] - The columns to update. This can either be a string or an object of type `ToSnakeCaseKeys<T>`.
 * * {string | ToUpdateCastType<T>} [options.valuesCast] - The columns to update. This can either be a string or an object of type `ToUpdateCastType`.
 * * {string} [options.columns] - Unsafe! this column is requered only if [options.values] has a string type. It needs to set query columns which values are update.
 * * {string} [options.returning] - this columns will be returned after update if provided.
 *
 * @returns {Prisma.Sql} A `Prisma.Sql` object that represents a generated SQL query to update data into a table.
 */
export function updateSql<T>(options: TUpdateOptions<T>): Prisma.Sql {
  const returnColumns = options.returning
    ? Prisma.sql`RETURNING ${selectToSql(options.returning)}`
    : Prisma.empty;
  const columns = calculateUpdateColumns(options);
  const update = getUpdateValues(options.values, options.valuesCast);

  return Prisma.sql`
UPDATE ${options.table}
SET (${columns}) = (SELECT ${update})
${options.where ? options.where : Prisma.empty}
${returnColumns}
  `;
}

// BULK UPDATE
// UPDATE ${table}
// SET ${Prisma.raw(columns.map(item => `${item} = t.${item}`).join(','))}
// FROM (
//   SELECT ${columns}
//   FROM unnest(${array}::jsonb[]) arr(${columnsCasted})
//   GROUP BY group_id
// ) AS t
// ${options.where ? options.where : Prisma.empty}
