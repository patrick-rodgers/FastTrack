const gulp = require("gulp"),
    exec = require("child_process").exec,
    path = require("path");

const tscPath = ".\\node_modules\\.bin\\tsc";

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

gulp.task("build", ["clean", "lint"], (done) => {

    exec(`${tscPath} -p ${path.join(projectRoot, "tsconfig.json")} --importHelpers`, (error, stdout, stderr) => {

        if (error === null) {
            done();
        } else {
            done(stdout);
        }
    });
});

