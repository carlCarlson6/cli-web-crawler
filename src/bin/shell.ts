import { match } from "ts-pattern";
import { type GameCommands } from "../game";
import { systemCommands } from "./commands";

export const shell = (input: string, gameCommands: GameCommands) => {
  console.log("Shell received input:", input);
  const commandKeyWord = input.split(" ").at(0)?.trim().toLowerCase();
  if (!commandKeyWord || commandKeyWord === '') {
    return '';
  }

  const maybeSystemCommand = systemCommands(gameCommands, input.split(" ").at(1)?.trim().toLowerCase())[commandKeyWord];
  if (maybeSystemCommand) {
    return maybeSystemCommand();
  }

  const commandParams = input.split(" ").at(1)?.trim().toLowerCase();

  return match(commandKeyWord as keyof GameCommands)
    .with("init",     () => gameCommands.init(input.split(" ").slice(1).join(" ")))  
    .with("move",     () => gameCommands.move(commandParams))
    .with("describe", () => gameCommands.describe())
    .with("player",   () => gameCommands.player())
    .with("attack",   () => gameCommands.attack(input.split(" ").slice(1).join(" ")))
    .with("map",      () => gameCommands.map())
    .with("search",   () => gameCommands.search())
    .exhaustive(      () => "Unknown command: " + commandKeyWord);
}