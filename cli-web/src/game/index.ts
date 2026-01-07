import { useEffect, useState } from "react";
import { describeRoom, describePlayer, init, move } from "./commands";
import { attackCommand } from "./commands/attack";
import { createNewGame } from "./utils";
import { showMapCommand } from "./commands/map";
import { searchCommand } from "./commands/search";
import { useItemCommand } from "./commands/use";
import type { ShellCommands } from "@/bin/shell";
import { gameSchema, type Game } from "cli-contracts/game";

export const gameStorageName = "game"; 

const loadSavedGame = () => {
  const savedState = localStorage.getItem(gameStorageName);
  if (!savedState) return createNewGame(undefined);

  const parsed = gameSchema.safeParse(JSON.parse(savedState));
  return parsed.data ?? createNewGame(undefined);
}

export const useGame = () => {
  const [game, setGame] = useState<Game>(loadSavedGame());

  useEffect(
    () => localStorage.setItem(gameStorageName, JSON.stringify(game)), 
    [game]);

  return {
    game, 
    commands: {
      "init":     (args) => init(setGame, args),
      "describe": ()    => describeRoom(game.currentRoom),
      "player":   ()    => describePlayer(game),
      "move":     (args) => move(setGame, game, args),
      "attack":   (args) => attackCommand(setGame, game, args),
      "map":      ()    => showMapCommand(game),
      "search":   ()    => searchCommand(game, setGame),
      "use":      (args) => useItemCommand(setGame, game, args)
    } satisfies ShellCommands as ShellCommands
  }
}

export type GameSystem = ReturnType<typeof useGame>;