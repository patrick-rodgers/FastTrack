const path = require("path"),
    exec = require("child_process").exec,
    gulp = require("gulp");

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

const rollupPath = ".\\node_modules\\.bin\\rollup";

gulp.task("package", ["build"], (done) => {

    exec(`${rollupPath} -c ${path.join(projectRoot, "rollup.dist.config.js")}`, (error, stdout, stderr) => {

        if (error === null) {
            done();
        } else {

            // rollup will output their error to stderr...
            done(stderr);
        }
    });
});

