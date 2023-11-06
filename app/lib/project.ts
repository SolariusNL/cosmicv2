import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import * as wasmoon from "wasmoon";
import { config } from "../main";
import { Logger, LoggingNamespace } from "./logger";

async function getAllFiles(
  dirPath: string,
  baseDir: string
): Promise<string[]> {
  const files: string[] = [];

  const getFilesRecursively = (currentDir: string, currentPath: string) => {
    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      if (statSync(fullPath).isDirectory()) {
        getFilesRecursively(fullPath, path.join(currentPath, entry));
      } else if (entry.endsWith(".lua")) {
        files.push(path.join(currentPath, entry));
      }
    }
  };

  getFilesRecursively(dirPath, "");

  return files;
}

async function runProject() {
  const factory = new wasmoon.LuaFactory();
  const lua = await factory.createEngine();

  try {
    const projectPath = config.projectPath;
    const luaScriptPath = path.join(projectPath);

    const files = await getAllFiles(luaScriptPath, luaScriptPath);

    for (const luaFilePath of files) {
      const data = readFileSync(path.join(luaScriptPath, luaFilePath), "utf-8");
      await factory
        .mountFile(luaFilePath, data)
        .then(() => {
          Logger.ns(LoggingNamespace.Lua).log(`Mounted ${luaFilePath}`);
        })
        .catch((error) => {
          Logger.ns(LoggingNamespace.Lua).error(
            `Failed to mount ${luaFilePath}: ${error}`
          );
        });
    }

    await lua.doFile("main.lua");
  } catch (error) {
    console.error("Error running Lua entry point:", error);
  } finally {
    lua.global.close();
  }
}

export default runProject;
