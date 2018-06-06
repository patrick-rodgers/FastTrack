import { UniversalBot, MemoryBotStorage } from "botbuilder";
import { AzureTableClient, AzureBotStorage } from "botbuilder-azure";
import { LogLevel, Logger } from "@pnp/logging";

export function applyStorage(bot: UniversalBot): UniversalBot {

    if (process.env.TeamsBot_StateStoreTableName) {
        return applyTableStorage(bot);
    }

    return applyMemoryStorage(bot);
}

function applyTableStorage(bot: UniversalBot): UniversalBot {

    const tableName = process.env.TeamsBot_StateStoreTableName || "BotState";
    const azureTableClient = new AzureTableClient(tableName, "UseDevelopmentStorage=true");
    const tableStorage = new AzureBotStorage({ gzipData: false }, azureTableClient);
    bot.set("storage", tableStorage);

    Logger.write("Added table storage", LogLevel.Info);

    return bot;
}

// this can be used for testing
function applyMemoryStorage(bot: UniversalBot): UniversalBot {
    bot.set("storage", new MemoryBotStorage());
    return bot;
}

