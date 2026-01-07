import type { Game } from "@/game/model";
import type { Files } from "../fileSystem";

export const saveCommand = (files: Files, game: Game) => {
  const saveContent = JSON.stringify({ files, game }, null, 2);
  const blob = new Blob([saveContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const saveFileName = `dungeon_save_${new Date().toISOString()}.json`;
  a.download = saveFileName;
  a.click();
  URL.revokeObjectURL(url);
  return `Game state saved to file: ${saveFileName}`;
}