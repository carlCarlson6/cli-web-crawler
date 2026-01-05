import type { Game } from "./model";

export const throwDice = () => Math.floor(Math.random() * 8) + 1;

export const level1 = [
  {
    id: 0,
    description: "You are in a dimly lit cave. There is a passage to the north.",
    connections: [
      { direction: "north", to: 1 }
    ],
    monsters: [],
  },
  {
    id: 1,
    description: "You have entered a forest clearing",
    connections: [
      { direction: "north", to: 2 },
      { direction: "south", to: 0 }, 
    ],
    monsters: [
      { name: "Goblin 01", health: 10, attack: 6, defense: 4 },
      { name: "Goblin 02", health: 10, attack: 6, defense: 4 },
    ],
  }, 
  {
    id: 2,
    description: "You are at the edge of a serene lake.",
    connections: [
      { direction: "north", to: 2 },
      { direction: "south", to: 1 }, 
    ],
    monsters: [
      { name: "Water Serpent", health: 15, attack: 8, defense: 6 }
    ],
  },
] satisfies Game["dungeon"];

const createNewPlayer = (name: string|undefined)=> {
  const constitution = throwDice() + throwDice();
  const strength     = throwDice() + throwDice();
  const agility      = throwDice() + throwDice();
  const intelligence = throwDice() + throwDice();

  return {
    name: name ?? "Explorer",
    level: 1,
    health: constitution * 3,
    magicPoints: Math.floor(intelligence / 2),
    stats: {
      constitution,
      strength,
      agility,
      intelligence,
    },
    equipment: {
      weapon: null,
      armor: null,
    },
    items: [],
  };
}

export const createNewGame = (name: string|undefined): Game => ({
  player:       createNewPlayer(name),
  mode:         "exploration",
  currentRoom:  level1[0],
  visitedRooms: [level1[0].id],
  dungeon:      level1,
});

export const banner =`
▄               ▖  ▖  ▌ 
▌▌▌▌▛▌▛▌█▌▛▌▛▌  ▌▞▖▌█▌▛▌
▙▘▙▌▌▌▙▌▙▖▙▌▌▌  ▛ ▝▌▙▖▙▌
      ▄▌                
`;