import { Log, LogLevel } from "./logging";
import { default as establishRoutes } from "./routes/all";
import { usingServer } from "./server";

establishRoutes.then(_ => {

    usingServer(server => {

        // start the server
        server.listen(process.env.FastTrack_UnifiedAPI_Port || 8080, () => {

            Log.write(`Server at ${server.url}.`, LogLevel.Info);
        });

        return Promise.resolve();
    });
});
