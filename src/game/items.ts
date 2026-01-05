import type { Game } from "./model";
import { dice } from "./utils";

export const items = [
  {
    name: "Minor Health Potion" as const,
    description: "Restores 1d8 health points when used.",
    searchDifficulty: 5,
    effect: (game: Game) => {
      const restoredHealth = game.player.health + dice();
      return {
        ...game,
        player: {
          ...game.player,
          health: restoredHealth > game.player.stats.constitution * 3 
            ? game.player.stats.constitution * 3 
            : restoredHealth,
          inventory: game.player.inventory.filter(i => i !== "Minor Health Potion")
        }
      };
    }
  }
];