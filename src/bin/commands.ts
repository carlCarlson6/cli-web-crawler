import type { GameCommands } from "@/game";
import { match } from "ts-pattern";
import { type FileSystem } from "./fileSystem";

export const systemCommands = (
  gameCommands: GameCommands,
  fileSystem: FileSystem,
  args: string | undefined
) : Record<string, () => string> => ({
  help: () => helpCommand(gameCommands, fileSystem, args),
  clear: () => {
    window.location.reload();
    return "";
  },
  ls: () => fileSystem.files.join("\n") || "No files found.",
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
    if (!args) return "Usage: cat [file_path]";
    const content = fileSystem.readFile(args);
    return content !== null ? content : `File not found: ${args}`;
  },
});

function helpCommand(
  gameCommands: GameCommands, 
  fileSystem: FileSystem,
  specificCommand: string | undefined): string {
  if (specificCommand) return match(specificCommand)
    .with("init",     () => [
      "Initialize a new game.", 
      "Usage: init [player_name]"])
    .with("describe", () => [
      "Describe the current room and its contents.", 
      "Usage: describe"])
    .with("player",   () => [
      "Show the player's stats and equipment.", ,
      "Usage: player"])
    .with("move",     () => [
      "Move the player in a specified direction." ,
      "Usage: move [north|south|east|west]"])
    .with("attack",   () => [
      "Attack a monster in the current room.", 
      "Usage: attack [monster_name].",
      "By default, attacks the first monster in the room."])
    .with("map",      () => [
      "Display the map of the game world.", 
      "Usage: map"])
    .with("search",   () => [
      "Search the current room for hidden items or passages.", 
      "Usage: search"])
    .with("use",      () => [
      "Use an item from the player's inventory.", 
      "Usage: use [item_name]"])
    .with("ls",     () => [
      "List files in the current directory.", 
      "Usage: ls"])
    .with("touch",  () => [
      "Create a new empty file.", 
      "Usage: touch [file_path]"])
    .with("write",  () => [
      "Write content to a file.", 
      "Usage: write [file_path] [content]"])
    .with("cat",    () => [
      "Display the content of a file.", 
      "Usage: cat [file_path]"])
    .otherwise(() => [
      "Unknown command. No help available."])
    .join("\n");

  const [system, game] = listAllCommands(gameCommands, fileSystem);

  return [
    `Displaying help information...`,
    `System Commands:`,
    `\t${system}`,
    `Game Commands:`,
    `\t${game}`,
    'Write help [command] to get more information about a specific command.'
  ].join("\n");
}

const listAllCommands = (gameCommands: GameCommands, fileSystem: FileSystem) => [
  Object.keys(systemCommands(gameCommands, fileSystem, undefined)).filter(x => x !== "help").join("\n\t"),
  Object.keys(gameCommands).join("\n\t")
];
  
  