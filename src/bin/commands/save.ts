import type { Game } from "@/game/model";
import type { Files } from "../fileSystem";
import type { Auth } from "../auth";

export const saveCommand = (files: Files, game: Game, auth: Auth) => {
  const saveFileName = `dungeon_save_${new Date().toISOString()}.json`;
  triggerDownload(saveFileName, files, game);

  if (auth.userInfo) {
    console.log("here we should call the server");
  }

  return `Game state saved to file: ${saveFileName}`;
}

const triggerDownload = (name: string, files: Files, game: Game) => {
  const saveContent = JSON.stringify({ files, game }, null, 2);
  const blob = new Blob([saveContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}