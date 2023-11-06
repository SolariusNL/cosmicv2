export enum LoggingNamespace {
  Core = "core",
  Configuration = "configuration",
  Lua = "lua",
}

const BOLD_START = "\x1b[1m";
const BOLD_END = "\x1b[22m";

const RED = "\x1b[31m";
const RESET = "\x1b[0m";
const ORANGE = "\x1b[38;5;208m";

export class Logger {
  private static instance: Logger;
  private static loggingNamespace: LoggingNamespace;

  private constructor() {}

  public static ns(loggingNamespace: LoggingNamespace): Logger {
    Logger.loggingNamespace = loggingNamespace;
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private print(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(
      `${BOLD_START}[${timestamp}] #${Logger.loggingNamespace}${BOLD_END}: ${message}`
    );
  }

  public log(message: string): Logger {
    this.print(message);
    return Logger.instance;
  }

  public error(message: string): Logger {
    this.print(`${RED}${message}${RESET}`);
    return Logger.instance;
  }

  public warn(message: string): Logger {
    this.print(`${ORANGE}${message}${RESET}`);
    return Logger.instance;
  }
}
