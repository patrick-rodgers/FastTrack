'use strict';

var botbuilder = require('botbuilder');
var botbuilderTeams = require('botbuilder-teams');
var restify = require('restify');
var logging = require('@pnp/logging');

let _botPromise = null;
function getBot() {
    logging.Logger.write("Entering getBot()", 0 /* Verbose */);
    if (_botPromise === null) {
        logging.Logger.write("getBot() :: Bot promise is null, returning.", 0 /* Verbose */);
        _botPromise = new Promise((resolve) => {
            const connector = new botbuilderTeams.TeamsChatConnector({
                appId: process.env.MicrosoftAppId,
                appPassword: process.env.MicrosoftAppPassword,
            });
            const bot = new botbuilder.UniversalBot(connector);
            // TODO:: testing??
            bot.set("storage", new botbuilder.MemoryBotStorage());
            // Setup Restify Server
            const server = restify.createServer();
            server.listen(process.env.port || 3978, function () {
                console.log(`${server.name} listening to ${server.url}`);
            });
            server.post("/api/messages", connector.listen());
            bot.use(botbuilder.Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));
            logging.Logger.write("getBot() :: Created new bot instance.", 1 /* Info */);
            resolve(bot);
        });
    }
    logging.Logger.write("getBot() :: Returning bot promise", 0 /* Verbose */);
    return _botPromise;
}
function usingBot(func) {
    getBot().then(b => func(b));
}

logging.Logger.activeLogLevel = 0 /* Verbose */;
logging.Logger.subscribe(new logging.ConsoleListener());
logging.Logger.write("Entering init()", 0 /* Verbose */);
usingBot(bot => {
    logging.Logger.write("init() :: Entering usingBot call", 0 /* Verbose */);
    // Entry point of the bot
    bot.dialog("/", [
        (session) => {
            logging.Logger.write("init() :: /", 0 /* Verbose */);
            session.replaceDialog("/promptButtons");
        },
    ]);
    bot.dialog("/promptButtons", [
        (session) => {
            logging.Logger.write("init() :: /promptButtons", 0 /* Verbose */);
            const choices = ["Musician Explorer", "Musician Search"];
            botbuilder.Prompts.choice(session, "How would you like to explore the classical music bot?", choices);
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
//# sourceMappingURL=index.js.map
