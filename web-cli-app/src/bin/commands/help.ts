import { match } from "ts-pattern";

export const helpDescriptions = (command: string) => match(command)
    .with("init",     () => [
      "Initialize a new game.", 
      "Usage: init [player_name]"])
    .with("describe", () => [
      "Describe the current room and its contents.", 
      "Usage: describe"])
    .with("player",   () => [
      "Show the player's stats and equipment.", ,
      "Usage: player"])
    .with("move",     () => [
      "Move the player in a specified direction." ,
      "Usage: move [north|south|east|west]"])
    .with("attack",   () => [
      "Attack a monster in the current room.", 
      "Usage: attack [monster_name].",
      "By default, attacks the first monster in the room."])
    .with("map",      () => [
      "Display the map of the game world.", 
      "Usage: map"])
    .with("search",   () => [
      "Search the current room for hidden items or passages.", 
      "Usage: search"])
    .with("use",      () => [
      "Use an item from the player's inventory.", 
      "Usage: use [item_name]"])
    .with("ls",     () => [
      "List files in the current directory.", 
      "Usage: ls"])
    .with("touch",  () => [
      "Create a new empty file.", 
      "Usage: touch [file_path]"])
    .with("write",  () => [
      "Write content to a file.", 
      "Usage: write [file_path] [content]"])
    .with("cat",    () => [
      "Display the content of a file.", 
      "Usage: cat [file_path]"])
    .with("save",   () => [
      "Save the current console state to a file.", 
      "Usage: save"])
    .with("load",   () => [
      "Load a console state from a file.", 
      "Usage: load"])
    .with("login", () => [
      "Initializes session. Allows to later on save the state on the cloud and enter in chats.",
      "Usage: login"])
    .with("logout", () => [
      "Closes session.",
      "Usage: logout",
    ])
    .otherwise(() => [
      "Unknown command. No help available."])
    .join("\n");