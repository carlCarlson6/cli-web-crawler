import { useEffect, useState } from "react";
import { gameSchema, type Game } from "./model";
import { describeRoom, describePlayer, init, move } from "./commands";
import { attackCommand } from "./commands/attack";
import { createNewGame } from "./utils";
import { showMapCommand } from "./commands/map";
import { searchCommand } from "./commands/search";
import { useItemCommand } from "./commands/use";
import { match } from "ts-pattern";

const loadSavedGame = () => {
  const savedState = localStorage.getItem("gameState");
  if (!savedState) return createNewGame(undefined);

  const parsed = gameSchema.safeParse(JSON.parse(savedState));
  return parsed.data ?? createNewGame(undefined);
}

export const useGame = () => {
  const [game, setGame] = useState<Game>(loadSavedGame());

  useEffect(
    () => localStorage.setItem("gameState", JSON.stringify(game)), 
    [game]);

  return {
    init:     (name?: string)        => init(setGame, name),
    describe: ()                     => describeRoom(game.currentRoom),
    player:   ()                     => describePlayer(game),
    move:     (direction?: string)   => move(setGame, game, direction),
    attack:   (monsterName?: string) => attackCommand(setGame, game, monsterName),
    map:      ()                     => showMapCommand(game),
    search:   ()                     => searchCommand(game, setGame),
    use:      (itemName?: string)    => useItemCommand(setGame, game, itemName)
  };
}

export type GameCommands = ReturnType<typeof useGame>;

export const runCommand = (
  commandKeyWord: string,
  commandInput: string,
  gameCommands: GameCommands
) => match(commandKeyWord as keyof GameCommands)
    .with("init",     () => gameCommands.init(commandInput.split(" ").slice(1).join(" ")))  
    .with("move",     () => gameCommands.move(commandInput.split(" ").at(1)?.trim().toLowerCase()))
    .with("describe", () => gameCommands.describe())
    .with("player",   () => gameCommands.player())
    .with("attack",   () => gameCommands.attack(commandInput.split(" ").slice(1).join(" ")))
    .with("map",      () => gameCommands.map())
    .with("search",   () => gameCommands.search())
    .with("use",      () => gameCommands.use(commandInput.split(" ").slice(1).join(" ")))
    .exhaustive(      () => `Unknown command: "${commandKeyWord}"`);
