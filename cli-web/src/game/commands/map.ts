import type { Game, Room } from "cli-contracts/game";

export function showMapCommand(game: Game) { 
  const dungeonMap = drawDungeonMap(game.dungeon, game.visitedRooms, game.currentRoom);
  return [
    "Dungeon Map:",
    dungeonMap
  ].join("\n");
}

function drawDungeonMap(_: Room[], __: number[], ___: Room) { 
  return `===== NOTHING TO SEE HERE YET =====`;
}