import { Prisma } from "@prisma/client";
import { TDeleteOptions } from "../../types/sqlMethodsWithCast";
import { selectToSql } from "./utils";

/**
 * Generates a SQL query to delete rows from a table based on given options.
 *
 * @param {object} options - An object containing the following properties:
 * * {Prisma.Sql} options.from - The table to select records from.
 * * {Prisma.Sql} [options.where] - The conditions to filter records by.
 * * {string} [options.returning] - this columns will be returned after insert if provided.
 *
 * @returns {Prisma.Sql} A `Prisma.Sql` object that represents a generated SQL query to select data from a table.
 */
export function deleteSql<T>(options: TDeleteOptions<T>): Prisma.Sql {
  const returnColumns = options.returning
    ? Prisma.sql`RETURNING ${selectToSql(options.returning)}`
    : Prisma.empty;
  return Prisma.sql`
DELETE FROM ${options.from}
${options.where ? options.where : Prisma.empty}
${returnColumns}
  `;
}
