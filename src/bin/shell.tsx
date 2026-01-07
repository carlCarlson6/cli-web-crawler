import type { Game } from "@/game/model";
import { runCommand, useGame, type GameCommands } from "../game";
import { systemCommands } from "./commands";
import { useFileSystem, type FileSystem } from "./fileSystem";
import { useAuth, type Auth } from "./auth";
import { useLoad } from "./commands/load";

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

export const useShell = () => {
  const [game, commands] = useGame();
  const fileSystem = useFileSystem()
  const { selectFile } = useLoad();
  const auth = useAuth();
  
  return shell(
      selectFile,
      auth,
      game,
      commands,
      fileSystem,
    );
}