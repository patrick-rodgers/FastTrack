'use strict';

var logging = require('@pnp/logging');
var botbuilder = require('botbuilder');
var botbuilderAzure = require('botbuilder-azure');
var botbuilderTeams = require('botbuilder-teams');
var restify = require('restify');

function botEventLogger(event, next) {
    logging.Logger.log({
        data: event,
        level: 0 /* Verbose */,
        message: `User '${event.user}' event of type ${event.type}. Address: ${event.address} ReplyToId: ${event.replyToId}`,
    });
    next();
}
function applyLogging(bot) {
    bot.use({
        receive: botEventLogger,
        send: botEventLogger,
    });
    logging.Logger.write("Added request logging", 1 /* Info */);
    return bot;
}

function applyStorage(bot) {
    if (process.env.TeamsBot_StateStoreTableName) {
        return applyTableStorage(bot);
    }
    return applyMemoryStorage(bot);
}
function applyTableStorage(bot) {
    const tableName = process.env.TeamsBot_StateStoreTableName || "BotState";
    const azureTableClient = new botbuilderAzure.AzureTableClient(tableName, "UseDevelopmentStorage=true");
    const tableStorage = new botbuilderAzure.AzureBotStorage({ gzipData: false }, azureTableClient);
    bot.set("storage", tableStorage);
    logging.Logger.write("Added table storage", 1 /* Info */);
    return bot;
}
// this can be used for testing
function applyMemoryStorage(bot) {
    bot.set("storage", new botbuilder.MemoryBotStorage());
    return bot;
}

function connectorFactory() {
    if (process.env.TeamsBot_ConsoleConnectorFlag) {
        return consoleConnector();
    }
    return teamsConnector();
}
function teamsConnector() {
    logging.Logger.write("Entering teamsConnector()", 0 /* Verbose */);
    // create connector
    const connector = new botbuilderTeams.TeamsChatConnector({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword,
    });
    logging.Logger.write("teamsConnector() :: Created connector", 0 /* Verbose */);
    // Setup Restify Server
    const server = restify.createServer();
    server.listen(process.env.port || 3978, function () {
        console.log(`${server.name} listening to ${server.url}`);
    });
    logging.Logger.write("teamsConnector() :: Created server", 0 /* Verbose */);
    server.post("/api/messages", connector.listen());
    logging.Logger.write("teamsConnector() :: Connector listening to server", 0 /* Verbose */);
    logging.Logger.write("Leaving teamsConnector()", 1 /* Info */);
    return connector;
}
function consoleConnector() {
    return new botbuilder.ConsoleConnector().listen();
}

function applyMiddleware(bot) {
    // setup middleware for dialogs
    bot.use(botbuilder.Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));
    logging.Logger.write("Added middleware", 1 /* Info */);
    return bot;
}

// promise used to setup the bot
let _botPromise = null;
const defaultBotConfiguration = [
    applyLogging,
    applyStorage,
    applyMiddleware,
];
function getBot(configuration = defaultBotConfiguration) {
    logging.Logger.write("Entering getBot()", 0 /* Verbose */);
    if (_botPromise === null) {
        logging.Logger.write("getBot() :: Bot promise is null, creating new", 0 /* Verbose */);
        _botPromise = new Promise((resolve) => {
            logging.Logger.write("getBot() :: Creating a new bot instance and resolving", 1 /* Info */);
            resolve(configuration.reduce((b, f) => f(b), new botbuilder.UniversalBot(connectorFactory())));
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
logging.Logger.write("Starting bot...", 0 /* Verbose */);
usingBot(bot => {
    logging.Logger.write("Bot started...", 0 /* Verbose */);
    // Entry point of the bot
    bot.dialog("/", [
        (session) => {
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
