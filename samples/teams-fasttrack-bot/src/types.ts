import { UniversalBot } from "botbuilder";

export type BotUsageDelegate = (b: UniversalBot) => void;

export type BotSetupDelegate = (b: UniversalBot) => UniversalBot;
