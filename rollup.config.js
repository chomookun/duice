import { terser } from "rollup-plugin-terser"; // 코드 압축
import { visualizer } from "rollup-plugin-visualizer";
import pkg from "./package.json";

const banner = `
/*!
 * ${pkg.name} - v${pkg.version}
 * git: https://gitbub.com/chomookun/duice
 * website: https://duice.chomookun.com
 * Released under the ${pkg.license} License
 */
`.trim();

export default {
    input: "dist/index.js",
    output: [
        {
            file: "dist/duice.js",
            format: "iife",
            name: "duice",
            sourcemap: true,
            banner: banner,
        },
        {
            file: "dist/duice.min.js",
            format: "iife",
            name: "duice",
            plugins: [terser()],
            sourcemap: true,
            banner: banner,
        }
    ],
    context: "window",
    plugins: [
        visualizer({
            filename: "./dist/bundle-analysis.html"
        })
    ],
    onwarn(warning, warn) {
        if (warning.code === "CIRCULAR_DEPENDENCY") {
            return;
        }
        warn(warning);
    }
};