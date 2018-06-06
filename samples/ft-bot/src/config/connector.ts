import { IConnector, ConsoleConnector } from "botbuilder";
import { TeamsChatConnector } from "botbuilder-teams";
import { Logger, LogLevel } from "@pnp/logging";
import { serverFactory } from "./server";

export function connectorFactory(): IConnector {

    if (process.env.FastTrack_Bot_ConsoleConnectorFlag) {
        return consoleConnector();
    }

    return teamsConnector();
}

function teamsConnector(): TeamsChatConnector {

    Logger.write("Entering teamsConnector()", LogLevel.Verbose);

    // create connector
    const connector = new TeamsChatConnector({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword,
    });

    Logger.write("teamsConnector() :: Created connector", LogLevel.Verbose);

    const server = serverFactory();

    Logger.write("teamsConnector() :: Created server", LogLevel.Verbose);

    server.post("/api/messages", connector.listen());

    Logger.write("teamsConnector() :: Connector listening to server", LogLevel.Verbose);

    Logger.write("Leaving teamsConnector()", LogLevel.Info);

    return connector;
}

function consoleConnector(): ConsoleConnector {
    Logger.write("Using ConsoleConnector", LogLevel.Verbose);
    return new ConsoleConnector().listen();
}
