const gulp = require("gulp"),
    gulpTslint = require("gulp-tslint"),
    tslint = require("tslint"),
    pump = require("pump");

gulp.task("lint", (done) => {

    var program = tslint.Linter.createProgram("./tsconfig.json");

    pump([
        gulp.src([
            "./src/**/*.ts",
            "!**/node_modules/**",
            "!**/*.d.ts"
        ]),
        gulpTslint({ formatter: "prose", program }),
        gulpTslint.report({ emitError: true }),
    ], (err) => {

        if (typeof err !== "undefined") {
            done(err);
        } else {
            done();
        }
    });
});
