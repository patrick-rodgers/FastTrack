import { createServer, Server, plugins } from "restify";
import { Log, LogLevel } from "./logging";

let serverPromise: Promise<Server> | null = null;

function setupServer(): Promise<Server> {

    if (serverPromise === null) {

        serverPromise = new Promise<Server>(resolve => {

            const server: Server = createServer();

            // setup pre handlers
            server.pre(plugins.pre.sanitizePath());

            // setup use handlers
            server.use(plugins.acceptParser(server.acceptable));
            server.use(plugins.bodyParser({
                keepExtensions: false,
                mapFiles: false,
                mapParams: true,
                maxBodySize: 1000,
                maxFieldsSize: 2 * 1024 * 1024,
                overrideParams: false,
                rejectUnknown: true,
            }));
            server.use(plugins.throttle({
                burst: 5,  // Max 10 concurrent requests (if tokens)
                ip: true,   // throttle per IP
                rate: 0.5,  // Steady state: 1 request / 2 seconds
            }));

            // setup after handlers
            server.on("after", plugins.metrics({ server: server },
                () => {
                    // arguments: err, metrics, req, res, route
                    Log.write("request happened", LogLevel.Verbose);
                }));

            resolve(server);
        });
    }

    return serverPromise;
}

export function usingServer(action: (s: Server) => Promise<void>): Promise<void> {
    return setupServer().then(s => action(s));
}
