import type { Game } from "@cli/contracts";
import { dice } from "./utils";

export const items = [
  {
    name: "Minor Health Potion" as const,
    description: "Restores 1d8 health points when used.",
    searchDifficulty: 5,
    use: (game: Game) => {
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
  },
  {
    name: "Minor Magic Potion" as const,
    description: "Restores 1d8 magic points when used.",
    searchDifficulty: 5,
    use: (game: Game) => {
      const restoredMagic = game.player.magicPoints + dice();
      return {
        ...game,
        player: {
          ...game.player,
          magicPoints: restoredMagic > Math.floor(game.player.stats.intelligence / 2)
            ? Math.floor(game.player.stats.intelligence / 2)
            : restoredMagic,
          inventory: game.player.inventory.filter(i => i !== "Minor Magic Potion")
        }
      };
    }
  },
  {
    name: "Short Sword" as const,
    description: "A basic short sword. Increases attack power when equipped.",
    searchDifficulty: 8,
    use: (game: Game) => {
      return {
        ...game,
        player: {
          ...game.player,
          equipment: {
            ...game.player.equipment,
            weapon: "Short Sword"
          },
          inventory: game.player.inventory.filter(i => i !== "Short Sword")
        }
      };
    },
    dammage: 1
  }, 
  {
    name: "Leather Armor" as const,
    description: "Basic leather armor. Increases defense when equipped.",
    searchDifficulty: 8,
    use: (game: Game) => {
      return {
        ...game,
        player: {
          ...game.player,
          equipment: {
            ...game.player.equipment,
            armor: "Leather Armor"
          },
          inventory: game.player.inventory.filter(i => i !== "Leather Armor")
        }
      };
    },
    defense: 1
  }
];