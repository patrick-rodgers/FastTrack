
import { LogLevel, Logger } from "@pnp/logging";
import { UniversalBot } from "botbuilder";
import { connectorFactory as _connectorFactory } from "./config/connector";
import { applyLogging } from "./config/logging";
import { applyMiddleware } from "./config/middleware";
import { applyStorage } from "./config/storage";
import { BotSetupDelegate, BotUsageDelegate } from "./types";

// promise used to setup the bot
let _botPromise: Promise<UniversalBot> | null = null;

// default delegates to apply to the created bot
const defaultBotConfiguration: BotSetupDelegate[] = [
    applyLogging,
    applyStorage,
    applyMiddleware,
];

export function getBot(configuration = defaultBotConfiguration, connectorFactory = _connectorFactory): Promise<UniversalBot> {

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

export function usingBot(func: BotUsageDelegate): Promise<UniversalBot> {

    return getBot().then(b => func(b));
}
