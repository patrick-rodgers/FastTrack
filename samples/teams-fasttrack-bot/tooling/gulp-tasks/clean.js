const gulp = require("gulp"),
    del = require("del"),
    log = require("fancy-log"),
    colors = require("ansi-colors");

gulp.task("clean", (done) => {

    const directories = [
        "./build",
        "./publish",
        "./dist",
    ];

    log(`${colors.bgBlue(" ")} Cleaning: ${directories.join(", ")}.`);
    del(directories).then(() => {
        log(`${colors.bgGreen(" ")} Cleaned: ${directories.join(", ")}.`);
        done();
    }).catch(e => {
        log(`${colors.bgRed(" ")} Error cleaning: ${directories.join(", ")}.`);
        done(e);
    });
});