import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";

// default to warning if no environment var is available
Logger.activeLogLevel = parseInt(process.env.FastTrack_LogLevel || "2", 10);
Logger.subscribe(new ConsoleListener());

export { Logger as Log, LogLevel };
