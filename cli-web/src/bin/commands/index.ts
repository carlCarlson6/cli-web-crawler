import { type FileSystem } from "../fileSystem";
import { helpDescriptions } from "./help";
import { saveCommand } from "./save";
import type { Auth } from "../auth";
import type { GameSystem } from "@/game";
import type { ShellCommands } from "../shell";

export const systemCommands = (
  selectLoadFile: () => void,
  auth: Auth,
  gameSystem: GameSystem,
  fileSystem: FileSystem,
) : ShellCommands => ({
  help: (args) => helpCommand(selectLoadFile, auth, gameSystem, fileSystem, args),
  clear: clearCommand,
  ls: (_) => fileSystem.listAllFiles().join("\n") || "No files found.",
  touch: (args) => {
    // TOOD: move to fileSystem
    if (!args) return "Usage: touch [file_path]";
    fileSystem.writeFile(args, "");
    return `File created: ${args}`;
  },
  write: (args) => {
    // TOOD: move to fileSystem
    if (!args) return "Usage: write [file_path] [content]";
    const [filePath, ...contentParts] = args.split(" ");
    const content = contentParts.join(" ");
    if (!filePath || !content) return "Usage: write [file_path] [content]";
    fileSystem.writeFile(filePath, content);
    return `Wrote to file: ${filePath}`;
  },
  cat:  (args) => fileSystem.readFile(args),
  save: () => saveCommand(fileSystem.files, gameSystem.game, auth),
  load: () => {
    selectLoadFile();
    return "";
  },
  login:  () => auth.login(),
  logout: () => auth.logOut(),
});

function clearCommand(): string {
  window.location.reload();
  return "";
}

function helpCommand(
  selectLoadFile: () => void,
  auth: Auth,
  gameSystem: GameSystem,
  fileSystem: FileSystem,
  specificCommand: string | undefined
): string {
  if (specificCommand) return helpDescriptions(specificCommand);

  const [systemCmdsStr, gameCmdsStr] = [
    Object.keys(systemCommands(selectLoadFile, auth, gameSystem, fileSystem)).filter(x => x !== "help").join("\n\t"),
    Object.keys(gameSystem.commands).join("\n\t")
  ];

  return [
    `Displaying help information...`,
    `System Commands:`,
    `\t${systemCmdsStr}`,
    `Game Commands:`,
    `\t${gameCmdsStr}`,
    'Write help [command] to get more information about a specific command.'
  ].join("\n");
}
  