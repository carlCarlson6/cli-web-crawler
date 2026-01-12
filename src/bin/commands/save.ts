import type { Game } from "~/game";
import type { Auth } from "../auth";
import type { Files } from "../files";
import type { SaveCliRequestPayload } from "~/server/saveCliStatus";
import { api } from "~/ui/react";

export const saveCommand = async (files: Files, game: Game, auth: Auth) => {
  const saveDate = new Date().toISOString();
  const saveFileName = `dungeon_save_${saveDate}.json`;
  triggerDownload(saveFileName, files, game);

  // migrate to tprc call
  const BE_BASE_URL = "TODO";
  if (auth.userInfo) {
    console.log("executing save");
    api.

    const result = await fetch(`${BE_BASE_URL}/api/save`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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