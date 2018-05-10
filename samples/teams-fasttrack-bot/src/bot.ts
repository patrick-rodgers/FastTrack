
import { UniversalBot } from "botbuilder";
import { Logger, LogLevel } from "@pnp/logging";
import { applyLogging } from "./config/logging";
import { applyStorage } from "./config/storage";
import { connectorFactory } from "./config/connector";
import { applyMiddleware } from "./config/middleware";
import { BotSetupDelegate, BotUsageDelegate } from "./types";

// promise used to setup the bot
let _botPromise: Promise<UniversalBot> | null = null;

const defaultBotConfiguration: BotSetupDelegate[] = [
    applyLogging,
    applyStorage,
    applyMiddleware,
];

export function getBot(configuration = defaultBotConfiguration): Promise<UniversalBot> {

    Logger.write("Entering getBot()", LogLevel.Verbose);

    if (_botPromise === null) {

        Logger.write("getBot() :: Bot promise is null, creating new", LogLevel.Verbose);

        _botPromise = new Promise((resolve) => {

            Logger.write("getBot() :: Creating a new bot instance and resolving", LogLevel.Info);

            resolve(configuration.reduce((b, f) => f(b), new UniversalBot(connectorFactory())));
        });
    }

    Logger.write("getBot() :: Returning bot promise", LogLevel.Verbose);

    return _botPromise;
}

export function usingBot(func: BotUsageDelegate): void {

    getBot().then(b => func(b));
}
