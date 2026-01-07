import type { GameCommands } from "@/game";
import { type FileSystem } from "../fileSystem";
import type { Game } from "@/game/model";
import { helpDescriptions } from "./help";

export const systemCommands = (
  selectLoadFile: () => void,
  game: Game,
  gameCommands: GameCommands,
  fileSystem: FileSystem,
  args: string | undefined
) : Record<string, () => string> => ({
  help: () => helpCommand(selectLoadFile, game, gameCommands, fileSystem, args),
  clear: clearCommand,
  ls: () => fileSystem.listAllFiles().join("\n") || "No files found.",
  touch: () => {
    if (!args) return "Usage: touch [file_path]";
    fileSystem.writeFile(args, "");
    return `File created: ${args}`;
  },
  write: () => {
    if (!args) return "Usage: write [file_path] [content]";
    const [filePath, ...contentParts] = args.split(" ");
    const content = contentParts.join(" ");
    if (!filePath || !content) return "Usage: write [file_path] [content]";
    fileSystem.writeFile(filePath, content);
    return `Wrote to file: ${filePath}`;
  },
  cat: () => {
    return fileSystem.readFile(args);
  },
  save: () => {
    const saveContent = JSON.stringify({ files: fileSystem.files, game }, null, 2);
    const blob = new Blob([saveContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const saveFileName = `dungeon_save_${new Date().toISOString()}.json`;
    a.download = saveFileName;
    a.click();
    URL.revokeObjectURL(url);
    return `Game state saved to file: ${saveFileName}`;
  },
  load: () => {
    selectLoadFile();
    return "";
  }
});

function clearCommand(): string {
  window.location.reload();
  return "";
}

function helpCommand(
  selectLoadFile: () => void,
  game: Game,
  gameCommands: GameCommands, 
  fileSystem: FileSystem,
  specificCommand: string | undefined
): string {
  if (specificCommand) return helpDescriptions(specificCommand);

  const [systemCmdsStr, gameCmdsStr] = [
    Object.keys(systemCommands(selectLoadFile, game, gameCommands, fileSystem, undefined)).filter(x => x !== "help").join("\n\t"),
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
  