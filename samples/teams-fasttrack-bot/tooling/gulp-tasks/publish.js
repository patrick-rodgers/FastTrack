const zipFolder = require("zip-folder"),
    path = require("path"),
    fs = require("fs"),
    gulp = require("gulp"),
    request = require("request");

// give outselves a single reference to the projectRoot
const projectRoot = path.resolve(__dirname, "../..");
const distFolder = path.join(projectRoot, "/dist");
const publishFolder = path.join(projectRoot, "/publish");
const zipPath = path.join(publishFolder, "bot.zip");

const kuduApi = "https://ftoss-test-bot.scm.azurewebsites.net/api/zip/site/wwwroot";
const userName = "patrodg-azuredeploy";
const password = "p-Ek-N7R1~^7";

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
                            done()
                        } else if (resp.statusCode >= 400) {
                            done(resp);
                        }
                    }).on("error", done);

                } else {
                    done(err);
                }
            });
        } else {
            done(err);
        }
    });
});
