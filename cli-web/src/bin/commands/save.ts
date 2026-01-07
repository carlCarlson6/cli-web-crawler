import type { Game } from "cli-contracts/game";
import type { Auth } from "../auth";
import { BE_BASE_URL } from "@/main";
import type { Files } from "cli-contracts/files";
import type { SaveCliRequestPayload } from "cli-contracts/api";

export const saveCommand = async (files: Files, game: Game, auth: Auth) => {
  const saveDate = new Date().toISOString();
  const saveFileName = `dungeon_save_${saveDate}.json`;
  triggerDownload(saveFileName, files, game);

  if (auth.userInfo) {
    console.log("executing save");
    const result = await fetch(`${BE_BASE_URL}/api/save`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "cache-control": "no-cache",
      },
      body: JSON.stringify({
        fileName: saveFileName,
        date: saveDate,
        files,
        game
      } satisfies SaveCliRequestPayload)
    });
    console.log("save request result", result.status);
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