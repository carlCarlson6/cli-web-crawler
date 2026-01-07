import type { Game } from "@/game/model";
import { runCommand, type GameCommands } from "../game";
import { systemCommands } from "./commands";
import { type FileSystem } from "./fileSystem";
import type { Auth } from "./auth";

export const shell = (
  selectLoadFile: () => void,
  auth: Auth,
  game: Game,
  gameCommands: GameCommands,
  fileSystem: FileSystem,
) => (
  input: string
) => {
  console.log("Shell received input:", input);
  const commandKeyWord = input.split(" ").at(0)?.trim().toLowerCase();
  if (!commandKeyWord || commandKeyWord === '') {
    return '';
  }

  const maybeSystemCommand = systemCommands(
    selectLoadFile,
    auth,
    game,
    gameCommands, 
    fileSystem, 
    input.split(" ").slice(1).join(" ")
  )[commandKeyWord];

  return !!maybeSystemCommand 
    ? maybeSystemCommand() 
    : runCommand(commandKeyWord, input, gameCommands);
}