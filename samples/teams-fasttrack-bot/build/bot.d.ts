import { UniversalBot } from "botbuilder";
import { BotSetupDelegate, BotUsageDelegate } from "./types";
export declare function getBot(configuration?: BotSetupDelegate[]): Promise<UniversalBot>;
export declare function usingBot(func: BotUsageDelegate): void;
