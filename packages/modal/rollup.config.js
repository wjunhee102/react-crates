import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

const packageJson = require("./package.json");

export default [
  {
    watch: {
      include: "src/**",
      exclude: ["node_modules/**"],
    },
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: process.env.NODE_ENV === "development" ? true : false,
      },
      {
        file: packageJson.module,
        format: "es",
        sourcemap: process.env.NODE_ENV === "development" ? true : false,
      },
    ],
    plugins: [
      PeerDepsExternalPlugin(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig:
          process.env.NODE_ENV === "development"
            ? "./tsconfig.json"
            : "./tsconfig.prod.json",
      }),
      postcss(),
      terser(),
      babel({
        babelHelpers: "bundled",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      }),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "es",
      },
    ],
    plugins: [dts.default()],
    external: [/\.css$/, /\.scss$/],
  },
];
