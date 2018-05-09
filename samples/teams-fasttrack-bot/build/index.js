import { usingBot } from "./bot";
import { Prompts } from "botbuilder";
import { Logger, ConsoleListener, } from "@pnp/logging";
export default function init() {
    Logger.activeLogLevel = 0 /* Verbose */;
    Logger.subscribe(new ConsoleListener());
    Logger.write("Entering init()", 0 /* Verbose */);
    usingBot(bot => {
        Logger.write("init() :: Entering usingBot call", 0 /* Verbose */);
        // Entry point of the bot
        bot.dialog("/", [
            (session) => {
                Logger.write("init() :: /", 0 /* Verbose */);
                session.replaceDialog("/promptButtons");
            },
        ]);
        bot.dialog("/promptButtons", [
            (session) => {
                Logger.write("init() :: /promptButtons", 0 /* Verbose */);
                const choices = ["Musician Explorer", "Musician Search"];
                Prompts.choice(session, "How would you like to explore the classical music bot?", choices);
            },
            (session, results) => {
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
}
//# sourceMappingURL=index.js.map