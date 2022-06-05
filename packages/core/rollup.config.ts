import { resolve } from "path";
import ts from "@rollup/plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: `dist/index.js`,
        format: "cjs",
      },
      {
        file: `dist/index.esm.js`,
        format: "esm",
      },
    ],
  },
  {
    input: "src/http.ts",
    output: [
      {
        file: "dist/http.js",
        format: "cjs",
      },
      {
        file: `dist/http.esm.js`,
        format: "esm",
      },
    ],
  },
  {
    input: "src/interceptors.ts",
    output: [
      {
        file: "dist/interceptors.js",
        format: "cjs",
      },
      {
        file: "dist/interceptors.esm.js",
        format: "esm",
      },
    ],
  },
  {
    input: "src/router.ts",
    output: [
      {
        file: "dist/router.js",
        format: "cjs",
      },
      {
        file: "dist/router.esm.js",
        format: "esm",
      },
    ],
  },
].map((item) => {
  return Object.assign(item, {
    externals: ["vue-router", "axios"],
    plugins: [
      ts({
        tsconfig: resolve(__dirname, "./tsconfig.json"),
      }),
    ],
  });
});
