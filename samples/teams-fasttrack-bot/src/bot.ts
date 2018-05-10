
import {
    UniversalBot,
    MemoryBotStorage,
    Middleware,
} from "botbuilder";

import {
    TeamsChatConnector,
} from "botbuilder-teams";

import {
    createServer,
} from "restify";

import {
    Logger,
    LogLevel,
} from "@pnp/logging";

let _botPromise: Promise<UniversalBot> | null = null;

export type BotDelegate = (b: UniversalBot) => void;

function getBot(): Promise<UniversalBot> {

    Logger.write("Entering getBot()", LogLevel.Verbose);

    if (_botPromise === null) {

        Logger.write("getBot() :: Bot promise is null, returning.", LogLevel.Verbose);

        _botPromise = new Promise((resolve) => {

            const connector = new TeamsChatConnector({
                appId: process.env.MicrosoftAppId,
                appPassword: process.env.MicrosoftAppPassword,
            });

            const bot = new UniversalBot(connector);

            // TODO:: testing??
            bot.set("storage", new MemoryBotStorage());

            // Setup Restify Server
            const server = createServer();
            server.listen(process.env.port || 3978, function () {
                console.log(`${server.name} listening to ${server.url}`);
            });
            server.post("/api/messages", connector.listen());

            bot.use(Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));

            Logger.write("getBot() :: Created new bot instance.", LogLevel.Info);

            resolve(bot);
        });
    }

    Logger.write("getBot() :: Returning bot promise", LogLevel.Verbose);

    return _botPromise;
}

export function usingBot(func: BotDelegate): void {

    getBot().then(b => func(b));
}
