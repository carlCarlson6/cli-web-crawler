"use client"
import { useEffect, useState } from "react";
import { type Game } from ".";
import { describePlayer, describeRoom, init, move } from "./commands";
import type { ShellCommands } from "~/bin/shell";
import { attackCommand } from "./commands/attack";
import { showMapCommand } from "./commands/map";
import { searchCommand } from "./commands/search";
import { useItemCommand } from "./commands/use";
import { loadSavedGame, saveGame } from "~/ui/localStorage";
import { createNewGame } from "~/game/utils";



export const useGame = () => {
  const [game, setGame] = useState<Game>(createNewGame(undefined));
  const updateGame = (game: Game) => {
    saveGame(game);
    setGame(game);
  }

  useEffect(
    () => {
      const savedGame = loadSavedGame();
      updateGame(savedGame);
    }, 
    []
  );

  return {
    game, 
    commands: {
      "init":     (args) => init(updateGame, args),
      "describe": ()     => describeRoom(game.currentRoom),
      "player":   ()     => describePlayer(game),
      "move":     (args) => move(setGame, game, args),
      "attack":   (args) => attackCommand(updateGame, game, args),
      "map":      ()     => showMapCommand(game),
      "search":   ()     => searchCommand(game, updateGame),
      "use":      (args) => useItemCommand(updateGame, game, args)
    } satisfies ShellCommands as ShellCommands
  }
}
