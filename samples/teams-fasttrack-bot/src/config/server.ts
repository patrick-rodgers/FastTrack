import { createServer, Server } from "restify";
import { Logger, LogLevel } from "@pnp/logging";

export interface ISimpleServer {
    post(url: string, handler: any): void;
}

export function serverFactory(): ISimpleServer {
    return createRestifyServer();
}

function createRestifyServer(): ISimpleServer {
    // Setup Restify Server
    const server = createServer();
    server.listen(process.env.port || 3978, function () {
        Logger.write(`${server.name} listening to ${server.url}`, LogLevel.Info);
    });
    return server;
}
