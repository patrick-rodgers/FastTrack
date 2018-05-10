import { Logger, LogLevel } from "@pnp/logging";
import { UniversalBot, IEvent } from "botbuilder";

function botEventLogger(event: IEvent, next: Function): void {

    Logger.log({
        data: event,
        level: LogLevel.Verbose,
        message: `User '${event.user}' event of type ${event.type}. Address: ${event.address} ReplyToId: ${event.replyToId}`,
    });
    next();
}

export function applyLogging(bot: UniversalBot): UniversalBot {

    bot.use({
        receive: botEventLogger,
        send: botEventLogger,
    });

    Logger.write("Added request logging", LogLevel.Info);

    return bot;
}
