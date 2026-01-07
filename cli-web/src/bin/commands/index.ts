import type { GameCommands } from "@/game";
import { type FileSystem } from "../fileSystem";
import type { Game } from "@/game/model";
import { helpDescriptions } from "./help";
import { saveCommand } from "./save";
import type { Auth } from "../auth";

export const systemCommands = (
  selectLoadFile: () => void,
  auth: Auth,
  game: Game,
  gameCommands: GameCommands,
  fileSystem: FileSystem,
  args: string | undefined
) : Record<string, () => string> => ({
  help: () => helpCommand(selectLoadFile, auth, game, gameCommands, fileSystem, args),
  clear: clearCommand,
  ls: () => fileSystem.listAllFiles().join("\n") || "No files found.",
  touch: () => {
    // TOOD: move to fileSystem
    if (!args) return "Usage: touch [file_path]";
    fileSystem.writeFile(args, "");
    return `File created: ${args}`;
  },
  write: () => {
    // TOOD: move to fileSystem
    if (!args) return "Usage: write [file_path] [content]";
    const [filePath, ...contentParts] = args.split(" ");
    const content = contentParts.join(" ");
    if (!filePath || !content) return "Usage: write [file_path] [content]";
    fileSystem.writeFile(filePath, content);
    return `Wrote to file: ${filePath}`;
  },
  cat: () => fileSystem.readFile(args),
  save: () => saveCommand(fileSystem.files, game, auth),
  load: () => {
    selectLoadFile();
    return "";
  },
  login: () => auth.login(),
  logout: () => auth.logOut(),
});

function clearCommand(): string {
  window.location.reload();
  return "";
}

function helpCommand(
  selectLoadFile: () => void,
  auth: Auth,
  game: Game,
  gameCommands: GameCommands, 
  fileSystem: FileSystem,
  specificCommand: string | undefined
): string {
  if (specificCommand) return helpDescriptions(specificCommand);

  const [systemCmdsStr, gameCmdsStr] = [
    Object.keys(systemCommands(selectLoadFile, auth, game, gameCommands, fileSystem, undefined)).filter(x => x !== "help").join("\n\t"),
    Object.keys(gameCommands).join("\n\t")
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
  