import { usingServer } from "../server";
import { Log, LogLevel } from "../logging";

const promise = usingServer(server => {

    Log.write("Adding root routes", LogLevel.Verbose);

    server.get("/", (req, res, next) => {

        res.send("howdy! I am but a server.");
        next();
    });

    return Promise.resolve();
});

export default promise;
