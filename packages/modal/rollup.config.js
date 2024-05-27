import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

function myLogger() {
  return {
    name: "my-logger", // 이 플러그인의 이름
    buildStart() {
      console.log("Build starting...");
    },
    load(id) {
      console.log(`Loading ${id}`);
      return null; // 다른 로드 처리를 방해하지 않도록 null 반환
    },
    transform(code, id) {
      console.log(`Transforming ${id}`);
      return null; // 코드를 변형하지 않고 원본 그대로 반환
    },
    buildEnd(error) {
      if (error) {
        console.log("Build failed:", error);
      } else {
        console.log("Build finished successfully.");
      }
    },
  };
}

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
        sourcemap: process.env.NODE_ENV === "development",
      },
      {
        file: packageJson.module,
        format: "es",
        sourcemap: process.env.NODE_ENV === "development",
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
    plugins: [dts.default(), myLogger],
    external: [/\.css$/, /\.scss$/],
  },
];
