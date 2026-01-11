import type { Game, UpdateGame } from "..";
import { items } from "../items";

export const useItemCommand = (
  updateGame: UpdateGame,
  game: Game,
  itemName?: string
) => {
  if (game.mode === "dead") return "You are dead and cannot use items. Please start a new game.";
  if (!itemName) return "Please specify an item to use.";

  const itemIndex = game.player.inventory.findIndex(i => i === itemName);
  if (itemIndex === -1) {
    return `You do not have a "${itemName}" in your inventory.`;
  }
  const item = items.find(i => i.name === itemName);
  if (!item) {
    return `Item "${itemName}" cannot be used.`;
  }

  const newGameState = item.use(game);
  updateGame(newGameState);

  return `You used "${item.name}".`; 
}