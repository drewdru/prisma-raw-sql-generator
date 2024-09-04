import { findManySql } from "./findManySql";
import { upsertSql } from "./upsertSql";
import { insertSql } from "./insertSql";
import { updateSql } from "./updateSql";
import { deleteSql } from "./deleteSql";
import { whereSql } from "./whereSql";

export default {
  name: "sqlMethodsWithCast",
  model: {
    $allModels: {
      findManySql,
      upsertSql,
      insertSql,
      updateSql,
      deleteSql,
      whereSql,
    },
  },
};

// COMPUTED FIELDS:
// const prisma = new PrismaClient()
//   .$extends({
//     result: {
//       user: {
//         fullName: {
//           needs: { firstName: true, lastName: true },
//           compute(user) {
//             return `${user.firstName} ${user.lastName}`;
//           },
//         },
//       },
//     },
//   })
//   .$extends({
//     result: {
//       user: {
//         displayName: {
//           needs: { fullName: true, email: true },
//           compute(user) {
//             return `${user.fullName} <${user.email}>`;
//           },
//         },
//       },
//     },
//   });

// Additional methods
// const prisma = new PrismaClient().$extends({
//   model: {
//     $allModels: {
//       async exists<T>(
//         this: T,
//         where: Prisma.Args<T, 'findFirst'>['where'],
//       ): Promise<boolean> {
//         const context = Prisma.getExtensionContext(this);
//         const result = await (context as any).findFirst({ where });
//         return result !== null;
//       },
//     },
//   },
// });

// Parse and Validate with YUP
// import { Profile } from "./schemas"; // YUP schema
// const prisma = new PrismaClient().$extends({
//   result: {
//     user: {
//       profile: {
//         needs: { profile: true },
//         compute({ profile }) {
//           return Profile.parse(profile);
//         },
//       },
//     },
//   },
//   query: {
//     user: {
//       create({ args, query }) {
//         args.data.profile = Profile.parse(args.data.profile);
//         return query(args);
//       },
//       createMany({ args, query }) {
//         const users = Array.isArray(args.data) ? args.data : [args.data];
//         for (const user of users) {
//           user.profile = Profile.parse(user.profile);
//         }
//         return query(args);
//       },
//       update({ args, query }) {
//         if (args.data.profile !== undefined) {
//           args.data.profile = Profile.parse(args.data.profile);
//         }
//         return query(args);
//       },
//       updateMany({ args, query }) {
//         if (args.data.profile !== undefined) {
//           args.data.profile = Profile.parse(args.data.profile);
//         }
//         return query(args);
//       },
//       upsert({ args, query }) {
//         args.create.profile = Profile.parse(args.create.profile);
//         if (args.update.profile !== undefined) {
//           args.update.profile = Profile.parse(args.update.profile);
//         }
//         return query(args);
//       },
//     },
//   },
// });
