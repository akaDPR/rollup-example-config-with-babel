import dotenv from "dotenv";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import image from "@rollup/plugin-image";
import visualizer from "rollup-plugin-visualizer";
import pkg from "./package.json";
import json from "@rollup/plugin-json";
import auto from "@rollup/plugin-auto-install";
import inject from "@rollup/plugin-inject";

dotenv.config();
let __source = ``;

if (process.env.NODE_ENV == "development") {
  __source = process.env.DEV_SERVER;
} else if (process.env.NODE_ENV == "uat") {
  __source = process.env.UAT_SERVER;
} else if (process.env.NODE_ENV == "production") {
  __source = process.env.PROD_SERVER;
}

export default {
  input: "src/index.js",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "esm" },
  ],
  plugins: [
    replace({
      exclude: "node_modules/**",
      __buildUrl__: JSON.stringify(__source),
    }),
    external(),
    postcss(),
    inject({
      Promise: ["es6-promise", "Promise"],
    }),
    babel({
      exclude: "node_modules/**",
    }),
    resolve(),
    commonjs(),
    image(),
    visualizer(),
    json(),
    auto(),
  ],
  moduleContext: {
    // [require.resolve("whatwg-fetch")]: "window",
  },
};
