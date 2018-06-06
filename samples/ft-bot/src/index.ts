import { ConsoleListener, LogLevel, Logger } from "@pnp/logging";
import { IFindMatchResult, IPromptResult, Prompts, Session } from "botbuilder";
import { Connection, ConnectionConfig } from "tedious";
import { usingBot } from "./bot";

Logger.activeLogLevel = LogLevel.Info;
Logger.subscribe(new ConsoleListener());
Logger.write("Starting bot...", LogLevel.Verbose);


const config: ConnectionConfig = {
    domain: "northamerica",
    options: {
        readOnlyIntent: true,
    },
    password: "",
    server: "FastTrackCubeProd",
    userName: "patrodg",
};

const connection = new Connection(config);

connection.on("connect", (err: any) => {

    if (err) {
        console.log(err);
    } else {
        console.log("Connected");
    }
});

usingBot(bot => new Promise(resolve => {

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

    resolve(bot);
}));
