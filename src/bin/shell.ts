import { runCommand, type GameCommands } from "../game";
import { systemCommands } from "./commands";
import { type FileSystem } from "./fileSystem";

export const shell = (
  input: string, 
  gameCommands: GameCommands,
  fileSystem: FileSystem,
) => {
  console.log("Shell received input:", input);
  const commandKeyWord = input.split(" ").at(0)?.trim().toLowerCase();
  if (!commandKeyWord || commandKeyWord === '') {
    return '';
  }

  const maybeSystemCommand = systemCommands(
    gameCommands, 
    fileSystem, 
    input.split(" ").slice(1).join(" ")
  )[commandKeyWord];

  return !!maybeSystemCommand 
    ? maybeSystemCommand() 
    : runCommand(commandKeyWord, input, gameCommands);
}