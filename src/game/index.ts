import { useEffect, useState } from "react";
import { gameSchema, type Game } from "./model";
import { describeRoom, describePlayer, init, move } from "./commands";
import { attackCommand } from "./commands/attack";
import { createNewGame } from "./utils";
import { showMapCommand } from "./commands/map";

const loadSavedGame = () => {
  const savedState = localStorage.getItem("gameState");
  if (!savedState) return createNewGame(undefined);

  const parsed = gameSchema.safeParse(JSON.parse(savedState));
  return parsed.data ?? createNewGame(undefined);
}

export const useGame = () => {
  const [game, setGame] = useState<Game>(loadSavedGame());

  useEffect(() => {
    localStorage.setItem("gameState", JSON.stringify(game))
  }, [game]);

  return {
    init:     (name?: string)        => init(setGame, name),
    describe: ()                     => describeRoom(game.currentRoom),
    player:   ()                     => describePlayer(game),
    move:     (direction?: string)   => move(setGame, game, direction),
    attack:   (monsterName?: string) => attackCommand(setGame, game, monsterName),
    map:      ()                     => showMapCommand(game),
  };
}

export type GameCommands = ReturnType<typeof useGame>;
