import type { Game, UpdateGame } from "cli-contracts/game";
import { items } from "../items";
import { dice } from "../utils";

export function searchCommand(
  game: Game,
  updateGame: UpdateGame,
) {
  if (game.mode !== "exploration") return "You cannot search while in combat or dead.";
  if (game.currentRoom.items.length === 0) return "You search the room but find nothing of interest.";

  const pickRandomItem = game.currentRoom.items[Math.floor(Math.random() * game.currentRoom.items.length)];
  const item = items.find(i => i.name === pickRandomItem) ?? {
    name: pickRandomItem,
    searchDifficulty: 3,
  };

  const found = dice() + game.player.stats.intelligence > item.searchDifficulty;
  if (!found) {
    updateGame(removeItem(pickRandomItem, game));
    return "You search the room but find nothing of interest.";
  }

  updateGame({
    ...removeItem(pickRandomItem, game),
    player: {
      ...game.player,
      inventory: [...game.player.inventory, pickRandomItem],
    },
  });
  return `You search the room and find a ${pickRandomItem}!`;
}

function removeItem(itemName: string, game: Game) {
  const updatedRoom = {
    ...game.currentRoom,
    items: game.currentRoom.items.filter(item => item !== itemName)
  };
  return {
    ...game,
    currentRoom: updatedRoom,
    dungeon: game.dungeon.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ),
  };
}