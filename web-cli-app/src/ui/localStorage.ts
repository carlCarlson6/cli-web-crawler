"use client"
import z from "zod";
import type { Files } from "~/bin/files";
import { gameSchema, type Game } from "~/game";
import { createNewGame } from "~/game/utils";

const gameStorageName = "game"; 
const filesStorageName = "files";

export const setLoadCliState = (game: Game, files: Files) => {
  localStorage.setItem(filesStorageName, JSON.stringify(files));
  localStorage.setItem(gameStorageName, JSON.stringify(game));
}

export const loadSavedFiles = () => {
  const savedFiles = localStorage.getItem(filesStorageName);
  if (!savedFiles) return {};

  const parsedFiles = z
    .record(z.string(), z.string())
    .safeParse(JSON.parse(savedFiles));
  return parsedFiles.data ?? {};
}

export const loadSavedGame = () => {
  const savedState = localStorage.getItem(gameStorageName);
  if (!savedState) return createNewGame(undefined);

  const parsed = gameSchema.safeParse(JSON.parse(savedState));
  return parsed.data ?? createNewGame(undefined);
}

export const saveFiles = (files: Files) => localStorage.setItem(filesStorageName, JSON.stringify(files));

export const saveGame = (game: Game) => localStorage.setItem(gameStorageName, JSON.stringify(game))