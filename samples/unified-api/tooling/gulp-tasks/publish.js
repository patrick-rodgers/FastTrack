const zipFolder = require("zip-folder"),
    path = require("path"),
    fs = require("fs"),
    gulp = require("gulp"),
    request = require("request"),
    settings = require("../../settings");

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");
const distFolder = path.join(projectRoot, "/dist");
const publishFolder = path.join(projectRoot, "/publish");
const zipPath = path.join(publishFolder, "bot.zip");

const kuduApi = settings.publish.kuduApiUrl;
const userName = settings.publish.user;
const password = settings.publish.pass;

gulp.task("publish", ["package"], (done) => {

    fs.mkdir(publishFolder, (err) => {
        if (!err) {

            zipFolder(distFolder, zipPath, (err) => {
                if (!err) {

                    fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
                        auth: {
                            username: userName,
                            password: password,
                            sendImmediately: true
                        },
                        headers: {
                            "Content-Type": "applicaton/zip"
                        }
                    })).on("response", (resp) => {
                        if (resp.statusCode >= 200 && resp.statusCode < 300) {
                            // fs.unlink(zipPath);
                            done();
                        } else if (resp.statusCode >= 400) {
                            done(resp);
                        }
                    }).on("error", done);

                } else {
                    done(JSON.stringify(err));
                }
            });
        } else {
            done(JSON.stringify(err));
        }
    });
});
