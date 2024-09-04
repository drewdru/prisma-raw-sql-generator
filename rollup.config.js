import multi from "@rollup/plugin-multi-entry";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
import { createMinifier } from "dts-minify";
import * as ts from "typescript";

const dtsMinifier = createMinifier(ts);
import { writeFileSync } from "fs";

function minifyDts(outputFilePath) {
  return {
    name: "minify-dts",
    transform(code, id) {
      writeFileSync(outputFilePath, dtsMinifier.minify(code));
      return null;
    },
  };
}

export default [
  {
    input: ["./src/**/*.ts"],
    output: [{ file: "lib/index.js", format: "cjs" }],
    plugins: [
      multi(),
      terser({ keep_classnames: true, keep_fnames: true }),
      typescript(),
    ],
    onwarn: function (warning, rollupWarn) {
      if (warning.code !== "UNRESOLVED_IMPORT") {
        // hide warning about node_modules they will be install in other projects
        rollupWarn(warning);
      }
    },
  },
  {
    input: ["./lib/**/*.d.ts"],
    output: [{ file: "lib/index.d.ts", format: "cjs" }],
    plugins: [multi(), dts()],
  },
  {
    input: "./lib/index.d.ts",
    output: [{ file: "/dev/null", format: "cjs" }],
    plugins: [dts(), minifyDts("./lib/index.d.ts")],
  },
];
