const gulp = require("gulp"),
    nodemon = require('gulp-nodemon');

gulp.task("run", ["package"], () => {

    return nodemon({
        script: "./dist/index.js", // run ES5 code
        watch: "./src", // watch ES2015 code
        tasks: ["package"], // compile synchronously onChange
        delay: 1,
        env: {
            "FastTrack_UnifiedAPI_Port": "8080",
            "FastTrack_LogLevel": "0",
        },
        ext: "ts,js,json"
    });
});
