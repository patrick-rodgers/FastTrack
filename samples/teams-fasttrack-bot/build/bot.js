import { UniversalBot, MemoryBotStorage, Middleware, } from "botbuilder";
import { TeamsChatConnector, } from "botbuilder-teams";
import { createServer, } from "restify";
import { Logger, } from "@pnp/logging";
let _botPromise = null;
function getBot() {
    Logger.write("Entering getBot()", 0 /* Verbose */);
    if (_botPromise === null) {
        Logger.write("getBot() :: Bot promise is null, returning.", 0 /* Verbose */);
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
            Logger.write("getBot() :: Created new bot instance.", 1 /* Info */);
            resolve(bot);
        });
    }
    Logger.write("getBot() :: Returning bot promise", 0 /* Verbose */);
    return _botPromise;
}
export function usingBot(func) {
    getBot().then(b => func(b));
}
//# sourceMappingURL=bot.js.map