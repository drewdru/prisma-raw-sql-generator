import { Prisma } from "@prisma/client";

/**
 * Change the type of Keys of T from NewType
 */
export type ChangeTypeOfKeys<
  T extends object,
  Keys extends keyof T,
  NewType
> = {
  // Loop to every key. We gonna check if the key
  // is assignable to Keys. If yes, change the type.
  // Else, retain the type.
  [key in keyof T]: key extends Keys ? NewType : T[key];
};

export type ToSnakeCase<T extends string> = T extends `${infer A}${infer B}`
  ? B extends Uncapitalize<B>
    ? `${Lowercase<A>}${ToSnakeCase<B>}`
    : `${Lowercase<A>}_${ToSnakeCase<Uncapitalize<B>>}`
  : T;

export type ToSnakeCaseKeys<T> = T extends object
  ? { [K in keyof T as ToSnakeCase<string & K>]: ToSnakeCaseKeys<T[K]> }
  : T;

export type ToCamelCase<T extends string> = T extends `${infer A}${infer B}`
  ? B extends Uncapitalize<B>
    ? `${Lowercase<A>}_${ToCamelCase<Uncapitalize<B>>}`
    : `${Lowercase<A>}${ToCamelCase<B>}`
  : T;

export type ToCamelCaseKeys<T> = T extends object
  ? { [K in keyof T as ToCamelCase<string & K>]: ToCamelCaseKeys<T[K]> }
  : T;

export type ToSelectWithCastType<T> = {
  [K in keyof T]?: true | string;
};

export type ToIncludeType<T> = {
  [K in keyof T]?: true;
};

export type ToSelectCastType<T> = ToSelectWithCastType<ToSnakeCaseKeys<T>>;
export type ToInsertCastType<T> = ToSelectWithCastType<ToSnakeCaseKeys<T>>;
export type ToIncludeCastType<T> = ToIncludeType<ToSnakeCaseKeys<T>>;

export type TDeleteOptions<T> = {
  from: Prisma.Sql;
  where?: Prisma.Sql;
  returning?: ToSelectCastType<T> | Prisma.Sql;
};

export type TFindManyOptions<T> = {
  select?: ToSelectCastType<T> | Prisma.Sql;
  from: Prisma.Sql;
  where?: Prisma.Sql;
};

export type TUpsertOptions<T> = {
  into: Prisma.Sql;
  confilct: Prisma.Sql;
  values: ToSnakeCaseKeys<T> | Prisma.Sql;
  valuesCast?: ToInsertCastType<T>;
  columns?: ToIncludeCastType<T> | Prisma.Sql; // requered only if options.values has a string type
  returning?: ToSelectCastType<T> | Prisma.Sql;
};

export type TInsertOptions<T> = {
  into: Prisma.Sql;
  values: ToSnakeCaseKeys<T> | Prisma.Sql;
  valuesCast?: ToInsertCastType<T>;
  columns?: ToIncludeCastType<T> | Prisma.Sql; // requered only if options.values has a string type
  returning?: ToSelectCastType<T> | Prisma.Sql;
};

export type TUpdateOptions<T> = {
  table: Prisma.Sql;
  values: ToSnakeCaseKeys<T> | Prisma.Sql;
  where?: Prisma.Sql;
  valuesCast?: ToInsertCastType<T>;
  columns?: ToIncludeCastType<T> | Prisma.Sql; // requered only if options.values has a string type
  returning?: ToSelectCastType<T> | Prisma.Sql;
};
