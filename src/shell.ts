import { match } from "ts-pattern";
import { type GameCommands } from "./game";

const systemCommands = (gameCommands: GameCommands): Record<string, () => string> => ({
  help: () => `Displaying help information...\nAvailable commands:\n\t${listAllCommands(gameCommands)}`,
  clear: () => {
    window.location.reload();
    return "";
  }
});

const listAllCommands = (gameCommands: GameCommands) => {
  return [
    ...Object.keys(systemCommands(gameCommands)),
    ...Object.keys(gameCommands)
  ].join("\n\t");
}

export const shell = (input: string, gameCommands: GameCommands) => {
  console.log("Shell received input:", input);
  const commandKeyWord = input.split(" ").at(0)?.trim().toLowerCase();
  if (!commandKeyWord || commandKeyWord === '') {
    return '';
  }

  const maybeSystemCommand = systemCommands(gameCommands)[commandKeyWord];
  if (maybeSystemCommand) {
    return maybeSystemCommand();
  }

  const commandParams = input.split(" ").at(1)?.trim().toLowerCase();

  const monsterToAcctak = input.split(" ").slice(1).join(" ").trim();
  console.log("monster to attack", monsterToAcctak);
  return match(commandKeyWord as keyof GameCommands)
    .with("move",     () => gameCommands.move(commandParams))
    .with("describe", () => gameCommands.describe())
    .with("init",     () => gameCommands.init(commandParams))
    .with("player",   () => gameCommands.player())
    .with("attack",   () => gameCommands.attack(monsterToAcctak))
    .with("map",      () => gameCommands.map())
    .exhaustive(      () => "Unknown command: " + commandKeyWord);
}