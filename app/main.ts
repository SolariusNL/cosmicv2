import { loadConfig, saveConfig } from "./lib/config";
import { Logger, LoggingNamespace } from "./lib/logger";
import runProject from "./lib/project";

export const config = loadConfig();

Logger.ns(LoggingNamespace.Core).log("Starting Cosmic...");

if (config.firstRun) {
  Logger.ns(LoggingNamespace.Core)
    .log("First run detected. Please configure Cosmic.")
    .log("The configuration file location has been outputted above.")
    .log("Open it in your preferred text editor and change the values.");

  config.firstRun = false;
  saveConfig(config);

  process.exit(0);
}

runProject();
