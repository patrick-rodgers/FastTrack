
import {
    ChatConnector,
    UniversalBot,
    MemoryBotStorage,
    Middleware,
} from "botbuilder";

import {
    createServer,
} from "restify";

import {
    Logger,
    LogLevel,
} from "@pnp/logging";

let _botPromise: Promise<UniversalBot> | null = null;

// export type BotDelegate = (b: UniversalBot, resolve: () => void, reject: (reason?: any) => void) => void;

export type BotDelegate = (b: UniversalBot) => void;

function getBot(): Promise<UniversalBot> {

    Logger.write("Entering getBot()", LogLevel.Verbose);

    if (_botPromise === null) {

        Logger.write("getBot() :: Bot promise is null, returning.", LogLevel.Verbose);

        _botPromise = new Promise((resolve) => {

            const connector = new ChatConnector({
                appId: "55d2e898-d1f3-4bb7-bfdb-4f1e6948b7aa",
                appPassword: "prwXN316]rnqeYDWQL58:;!",
                gzipData: true,
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
