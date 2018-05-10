import { UniversalBot } from "botbuilder";
import { Logger } from "@pnp/logging";
import { applyLogging } from "./config/logging";
import { applyStorage } from "./config/storage";
import { connectorFactory } from "./config/connector";
import { applyMiddleware } from "./config/middleware";
// promise used to setup the bot
let _botPromise = null;
const defaultBotConfiguration = [
    applyLogging,
    applyStorage,
    applyMiddleware,
];
export function getBot(configuration = defaultBotConfiguration) {
    Logger.write("Entering getBot()", 0 /* Verbose */);
    if (_botPromise === null) {
        Logger.write("getBot() :: Bot promise is null, creating new", 0 /* Verbose */);
        _botPromise = new Promise((resolve) => {
            Logger.write("getBot() :: Creating a new bot instance and resolving", 1 /* Info */);
            resolve(configuration.reduce((b, f) => f(b), new UniversalBot(connectorFactory())));
        });
    }
    Logger.write("getBot() :: Returning bot promise", 0 /* Verbose */);
    return _botPromise;
}
export function usingBot(func) {
    getBot().then(b => func(b));
}
//# sourceMappingURL=bot.js.map