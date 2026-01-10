import { match } from "ts-pattern";
import { dice } from "../utils";
import { items } from "../items";
import type { Game, Monster } from "@cli/contracts";

export const attackCommand = (
  updateGame: (game: Game) => void,
  game: Game,
  monsterName?: string
) => {
  const guard = match(game.mode)
    .with("combat", () => undefined)
    .with("dead", () => "You are dead and cannot attack. Please start a new game.")
    .with("exploration", () => undefined)
    .exhaustive();
  if (!!guard) return guard;
  if (game.currentRoom.monsters.length === 0) return "There are no monsters to attack in this room.";

  const dialogs = [
    `You engage in combat with the monsters!`
  ];

  const monsterTarget = game.currentRoom.monsters
      .find(m => m.name.toLowerCase() === monsterName?.toLowerCase()) 
    ?? game.currentRoom.monsters[0];
  const actionsOrder = defineOrder(game);

  const result = actionsOrder.reduce<Game>((current, actor) => {
    if (current.mode === "dead") return current;
    if (actor.type === "monster") {
      const { game: newGameState, dialogs: newDialogs } = monsterAttack(actor.name, current);
      dialogs.push(...newDialogs);
      return newGameState;
    }
    if (actor.type === "player") {
      const { game: newGameState, dialogs: newDialogs } = playerAttack(current, monsterTarget);
      dialogs.push(...newDialogs);
      return newGameState;
    }
    return current;
  }, game);

  updateGame(result);
  
  return dialogs.join("\n");
}

function calculateIniciative(agility: number) {
  return agility + dice();
}

function defineOrder(game: Game) {
  return [
    ...game.currentRoom.monsters.map(m => ({
      type: "monster" as const,
      initiative: calculateIniciative(m.attack),
      name: m.name,
    })),
    {
      type: "player" as const,
      initiative: calculateIniciative(game.player.stats.agility)
    }
  ].sort((a, b) => b.initiative - a.initiative);
}

function monsterAttack(monsterName: string, game: Game): { game: Game; dialogs: string[] } {
  const monster = game.currentRoom.monsters.find(m => m.name === monsterName);
  if (!monster) return { game, dialogs: [] };

  const monsterActack = monster.attack + dice();
  const playerArmor = items.find(i => i.name === game.player.equipment.armor)?.defense ?? 0
  const playerDefense = dice() + playerArmor + Math.max(game.player.stats.constitution, game.player.stats.agility);
  const damage = monsterActack - playerDefense;
  const resultingDamage = damage > 0 ? damage : 0;

  const updatedPlayerHealth = game.player.health - resultingDamage;
  const dialogs = [
    `${monster.name} attacks you for ${resultingDamage} damage! Your health is now ${updatedPlayerHealth > 0 ? updatedPlayerHealth : 0}.`
  ];

  if (updatedPlayerHealth <= 0) {
    return {
      game: {
        ...game,
        mode: "dead" as const,
        player: { ...game.player, health: 0 }
      },
      dialogs: [
        ...dialogs, 
        `You have been defeated by ${monster.name}. Game over.`, 
        "You are now dead. Restart the game with init to play again."
      ]
    };
  }
  return {
    game: {
      ...game,
      player: { ...game.player, health: updatedPlayerHealth }
    },
    dialogs
  };
}

function playerAttack(game: Game, monster: Monster): { game: Game; dialogs: string[] } {
  const equipedWeapon = items.find(i => i.name === game.player.equipment.weapon)?.dammage ?? 0;
  const playerAttackValue = dice() + game.player.stats.strength + equipedWeapon;
  const monsterDefense = monster.defense + dice();
  const damage = playerAttackValue - monsterDefense;
  const resultingDamage = damage > 0 ? damage : 0;

  const updatedMonsterHealth = monster.health - resultingDamage;
  const dialogs = [
    `You attack ${monster.name} for ${resultingDamage} damage! Its health is now ${updatedMonsterHealth > 0 ? updatedMonsterHealth : 0}.`
  ];
  if (updatedMonsterHealth <= 0) {
    dialogs.push(`You have defeated ${monster.name}!`);
  }

  const updatedMonsters = game.currentRoom.monsters
    .map(m => m.name === monster.name ? { ...m, health: updatedMonsterHealth } : m)
    .filter(m => m.health > 0);

  const newMode = updatedMonsters.length === 0 ? "exploration" : "combat";
  if (newMode === "exploration") {
    dialogs.push("All monsters have been defeated! You are no longer in combat.");
  }

  const updatedCurrentRoom = {
    ...game.currentRoom,
    monsters: updatedMonsters
  }
  const updatedRooms = game.dungeon.map(room => room.id === updatedCurrentRoom.id ? updatedCurrentRoom : room);

  return {
    game: {
      ...game,
      mode: newMode,
      currentRoom: updatedCurrentRoom,
      dungeon: updatedRooms
    },
    dialogs
  };
}