import { UniversalBot } from "botbuilder";
export declare type BotDelegate = (b: UniversalBot) => void;
export declare function usingBot(func: BotDelegate): void;
