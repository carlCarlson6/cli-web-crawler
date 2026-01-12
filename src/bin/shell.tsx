"use client"
import { systemCommands } from "./commands";
import { useFilesSystem, type FileSystem } from "./files/useFilesSystem";
import { useAuth, type Auth } from "./auth";
import { useLoad } from "./commands/load";
import { useGame, } from "~/game/useGame";
import type { GameSystem } from "~/game";

export type ShellCommands = Record<string, (args: string|undefined) => string|Promise<string>>;

export const shell = (
  selectLoadFile: () => void,
  auth: Auth,
  gameSystem: GameSystem,
  fileSystem: FileSystem,
) => async (
  input: string
) => {
  console.log("Shell received input:", input);
  const commandKeyWord = input.split(" ").at(0)?.trim().toLowerCase();
  if (!commandKeyWord || commandKeyWord === '') return '';

  const sysCommands = systemCommands(
    selectLoadFile,
    auth,
    gameSystem,
    fileSystem,
  );
  const commands = {
    ...gameSystem.commands,
    ...sysCommands,
  } satisfies ShellCommands;
  const maybeCommand = commands[commandKeyWord];
  if (!maybeCommand) return `Unknown command: "${commandKeyWord}"`;

  return await maybeCommand((input.split(" ").slice(1).join(" ")))
}

export type Shell = ReturnType<typeof shell>;

export const useShell = () => {
  const gameSystem = useGame();
  const fileSystem = useFilesSystem()
  const { selectFile } = useLoad();
  const auth = useAuth();
  
  return {
    shell: shell(
      selectFile,
      auth,
      gameSystem,
      fileSystem,
    ),
    user: auth.userInfo
  }
}