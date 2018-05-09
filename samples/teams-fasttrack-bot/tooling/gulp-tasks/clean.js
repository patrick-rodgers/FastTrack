const gulp = require("gulp"),
    del = require("del"),
    log = require("fancy-log"),
    colors = require("ansi-colors");

gulp.task("clean", (done) => {

    const directories = [
        "./build",
        "./dist",
    ];

    log(`${colors.bgBlue(" ")} Cleaning directories: ${directories.join(", ")}.`);
    del(directories).then(() => {
        log(`${colors.bgGreen(" ")} Cleaned directories: ${directories.join(", ")}.`);
        done();
    }).catch(e => {
        log(`${colors.bgRed(" ")} Error cleaned directories: ${directories.join(", ")}.`);
        done(e);
    });
});