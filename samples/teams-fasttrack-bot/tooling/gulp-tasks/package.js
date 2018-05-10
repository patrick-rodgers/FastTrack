const path = require("path"),
    exec = require("child_process").exec,
    gulp = require("gulp");

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");

const rollupPath = ".\\node_modules\\.bin\\rollup";

gulp.task("copy-assets", ["clean"], () => {

    return gulp.src(["./assets/**/*.*", "./package.json"]).pipe(gulp.dest("./dist"));
});

gulp.task("package", ["build", "copy-assets"], (done) => {

    exec(`${rollupPath} -c ${path.join(projectRoot, "rollup.dist.config.js")}`, (error, stdout, stderr) => {

        if (error === null) {

            done();
        } else {

            // rollup will output their error to stderr...
            done(stderr);
        }
    });
});

