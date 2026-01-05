import { match } from "ts-pattern";
import { type Game, type Room } from "../model";
import { createNewGame } from "../utils";

export const init = (
  setGame: (game: Game) => void,
  name?: string,
) => {
  const newGameState = createNewGame(name);
  setGame(newGameState);
  return [
    `Game initialized. Welcome ${newGameState.player.name}!`,
    "A new journey is ahead of you. Let the adventure begin!",
    describeRoom(newGameState.currentRoom),
  ].join("\n");
}

export const describeRoom = (room: Room) => {
  const toDisplay = [room.description];

  if (room.monsters.length > 0) {
    const monsterDescriptions = room.monsters
      .map(monster => `- ${monster.name}`)
      .join("\n\t");
    toDisplay.push(`Monsters in the room, you are now in combat`);
    toDisplay.push(`\t${monsterDescriptions}`);
  }

  return toDisplay.join("\n")
};

export const describePlayer = (game: Game) => [
  "These are the the player stats:",
  `Name: ${game.player.name}`,
  `Level: ${game.player.level}`,
  `Health: ${game.player.health}`,
  `Magic Points: ${game.player.magicPoints}`,
  `Stats:`,
  `  Constitution: ${game.player.stats.constitution}`,
  `  Strength:     ${game.player.stats.strength}`,
  `  Agility:      ${game.player.stats.agility}`,
  `  Intelligence: ${game.player.stats.intelligence}`,
  `Equipment:`,
  `  Weapon: ${game.player.equipment.weapon ?? "None"}`,
  `  Armor:  ${game.player.equipment.armor ?? "None"}`,
  `Items: ${game.player.items.length > 0 ? game.player.items.join(", ") : "None"}`
].join("\n\t");

export const move = (
  setGame: (game: Game) => void,
  game: Game,
  direction?: string
) => {
  const guard = match(game)
    .with({ mode: "combat" }, () => "You cannot move while in combat! Defeat the monsters first.")
    .with({ mode: "dead" }, () => "You are dead and cannot move. Please start a new game.")
    .with({ mode: "exploration" }, () => undefined)
    .exhaustive();
  if (guard) return guard;

  if (!direction) return "Please specify a direction to move (north, south, east, west).";
  if (game.currentRoom.monsters.length > 0) return "You cannot move while in combat! Defeat the monsters first.";

  const connection = game.currentRoom.connections.find(conn => conn.direction === direction);
  if (!connection) return `You can't go ${direction} from here.`;
  
  const nextRoom = game.dungeon.find(room => room.id === connection.to);
  if (!nextRoom) return "The path seems to lead nowhere.";

  setGame({ 
    ...game, 
    currentRoom: nextRoom, 
    visitedRooms: [...new Set([...game.visitedRooms, nextRoom.id])],
    mode: nextRoom.monsters.length > 0 ? "combat" : "exploration",
  });
  return [`You move ${direction}.`, describeRoom(nextRoom)].join("\n");
}

