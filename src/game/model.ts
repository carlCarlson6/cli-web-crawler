import z from "zod";

const playerSchema = z.object({
  name:           z.string(),
  level:        z.number().min(1),
  health:       z.number().min(0),
  magicPoints:  z.number().min(0),
  stats:  z.object({
    constitution: z.number().min(0),
    strength:     z.number().min(0),
    agility:      z.number().min(0),
    intelligence: z.number().min(0),
  }),
  equipment: z.object({
    weapon: z.string().nullable(),
    armor:  z.string().nullable(),
  }),
  items: z.array(z.string()),
});

const monsterSchema = z.object({
  name:   z.string(),
  health: z.number().min(0),
  attack: z.number().min(0),
  defense:z.number().min(0),
});

const roomSchema = z.object({
  id: z.number(),
  description: z.string(),
  connections: z.array(z.object({
    direction: z.enum(["north", "south", "east", "west"]),
    to: z.number()
  })),
  monsters: monsterSchema.array(),
});

export const gameSchema = z.object({
  player:       playerSchema,
  mode:         z.enum(["exploration", "combat", "dead"]),
  currentRoom:  roomSchema,
  visitedRooms: z.array(z.number()),
  dungeon:      z.array(roomSchema),
});

export type Monster = z.infer<typeof monsterSchema>;
export type Player = z.infer<typeof playerSchema>;
export type Room = z.infer<typeof roomSchema>;
export type Game = z.infer<typeof gameSchema>;
