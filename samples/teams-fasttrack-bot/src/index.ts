import { usingBot } from "./bot";
import { Session, IPromptResult, IFindMatchResult, Prompts } from "botbuilder";
import { Logger, ConsoleListener, LogLevel } from "@pnp/logging";

Logger.activeLogLevel = LogLevel.Verbose;
Logger.subscribe(new ConsoleListener());
Logger.write("Starting bot...", LogLevel.Verbose);

usingBot(bot => {

    Logger.write("Bot started...", LogLevel.Verbose);

    // Entry point of the bot
    bot.dialog("/", [
        (session) => {
            session.replaceDialog("/promptButtons");
        },
    ]);

    bot.dialog("/promptButtons", [
        (session: Session) => {
            Logger.write("init() :: /promptButtons", LogLevel.Verbose);
            const choices = ["Musician Explorer", "Musician Search"];
            Prompts.choice(session, "How would you like to explore the classical music bot?", choices);
        },
        (session: Session, results: IPromptResult<IFindMatchResult>) => {
            if (results.response) {
                const selection = results.response.entity;
                // route to corresponding dialogs
                switch (selection) {
                    case "Musician Explorer":
                        session.replaceDialog("/musicianExplorer");
                        break;
                    case "Musician Search":
                        session.replaceDialog("/musicianSearch");
                        break;
                    default:
                        session.reset("/");
                        break;
                }
            }
        },
    ]);
});

