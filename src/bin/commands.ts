import type { GameCommands } from "@/game";
import { match } from "ts-pattern";

export const systemCommands = (gameCommands: GameCommands, args: string | undefined): Record<string, () => string> => ({
  help: () => helpCommand(gameCommands, args),
  clear: () => {
    window.location.reload();
    return "";
  }
});

function helpCommand(gameCommands: GameCommands, specificCommand: string | undefined): string {
  if (specificCommand) return match(specificCommand)
    .with("init",     () => [
      "Initialize a new game. Usage: init [player_name]"])
    .with("describe", () => [
      "Describe the current room and its contents. Usage: describe"])
    .with("player",   () => [
      "Show the player's stats and equipment. Usage: player"])
    .with("move",     () => [
      "Move the player in a specified direction. Usage: move [north|south|east|west]"])
    .with("attack",   () => [
      "Attack a monster in the current room. Usage: attack [monster_name].",
      "By default, attacks the first monster in the room."])
    .with("map",      () => [
      "Display the map of the game world. Usage: map"])
    .with("search",   () => [
      "Search the current room for hidden items or passages. Usage: search"])
    .with("use",      () => [
      "Use an item from the player's inventory. Usage: use [item_name]"])
    .otherwise(() => [
      "Unknown command. No help available."])
    .join("\n");

  return [
      `Displaying help information...`,
      `Available commands:`,
      `\t${listAllCommands(gameCommands)}`,
      'Write help [command] to get more information about a specific command.'
    ].join("\n");
}

const listAllCommands = (gameCommands: GameCommands) => [
    ...Object.keys(systemCommands(gameCommands, undefined)),
    ...Object.keys(gameCommands)]
  .filter(x => x !== "help")
  .join("\n\t");