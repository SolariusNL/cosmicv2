import fs from "fs";
import os from "os";
import path, { join } from "path";
import { Logger, LoggingNamespace } from "./logger";

interface CosmicConfiguration {
  local: boolean;
  nucleusKey: string;
  firstRun: boolean;
  projectPath: string;
}

const defaultConfig: CosmicConfiguration = {
  local: false,
  nucleusKey: "CHANGE_ME",
  firstRun: true,
  projectPath: "",
};

let configDir;

if (os.platform() === "win32") {
  configDir = process.env.APPDATA;
} else {
  configDir = join(os.homedir(), ".config");
}

if (!configDir) {
  throw new Error("Unable to determine the configuration directory.");
}

const configFilePath = path.join(configDir, "cosmicv2", "config.json");

Logger.ns(LoggingNamespace.Configuration).log(
  `Configuration file path: ${configFilePath}`
);

function loadConfig(): CosmicConfiguration {
  try {
    const configData = fs.readFileSync(configFilePath, "utf-8");
    const config = JSON.parse(configData);
    return { ...defaultConfig, ...config };
  } catch (error) {
    saveConfig(defaultConfig);
    return defaultConfig;
  }
}

function saveConfig(config: CosmicConfiguration): void {
  const configDir = path.dirname(configFilePath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}

export { CosmicConfiguration, loadConfig, saveConfig };
