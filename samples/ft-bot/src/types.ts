import { UniversalBot } from "botbuilder";

export type BotUsageDelegate = (b: UniversalBot) => Promise<UniversalBot>;

export type BotSetupDelegate = (b: UniversalBot) => UniversalBot;
