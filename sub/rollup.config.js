import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
export default {
  input: "src/index.ts", // our source file
  output: {
    file: "build/bundle.js",
    format: "commonjs" // the preferred format
  },
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    typescript({
      typescript: require("typescript")
    }),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: ["node_modules/**"], // Default: undefined

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false, // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false // Default: true
    }),
    nodeResolve({
      jsnext: true,
      main: false
    }),

    terser() // minifies generated bundles
  ]
};
