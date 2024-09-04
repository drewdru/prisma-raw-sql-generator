import { Prisma } from "@prisma/client";
import { TFindManyOptions } from "../../types/sqlMethodsWithCast";
import { selectToSql } from "./utils";

/**
 * Generates a SQL query to select specific columns from a table based on given options.
 *
 * @param {object} options - An object containing the following properties:
 * * {string | ToSelectCastType<T>} [options.select] - The columns to select. This can either be a string or an object of type `ToSelectCastType`.
 * * {Prisma.Sql} options.from - The table to select records from.
 * * {Prisma.Sql} [options.where] - The conditions to filter records by.
 *
 * @returns {Prisma.Sql} A `Prisma.Sql` object that represents a generated SQL query to select data from a table.
 */
export function findManySql<T>(options: TFindManyOptions<T>): Prisma.Sql {
  const selectColumns = selectToSql(options.select);
  return Prisma.sql`
SELECT ${selectColumns}
FROM ${options.from}
${options.where ? options.where : Prisma.empty}
  `;
}
