import { UniversalBot, Middleware } from "botbuilder";
import { Logger, LogLevel } from "@pnp/logging";

export function applyMiddleware(bot: UniversalBot): UniversalBot {
    // setup middleware for dialogs
    bot.use(Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));

    Logger.write("Added middleware", LogLevel.Info);

    return bot;
}
