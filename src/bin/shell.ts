import { runCommand, type GameCommands } from "../game";
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

  return runCommand(commandKeyWord, input, gameCommands);
}