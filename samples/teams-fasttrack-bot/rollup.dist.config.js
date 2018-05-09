const sourcemaps = require("rollup-plugin-sourcemaps");

module.exports = {
    input: `./build/index.js`,
    plugins: [
        sourcemaps(),
    ],
    output: {
        file: `./dist/index.js`,
        format: "cjs",
        sourcemap: true,
    }
};
