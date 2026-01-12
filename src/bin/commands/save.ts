import type { Game } from "~/game";
import type { Auth } from "../auth";
import type { Files } from "../files";
import type { SaveCliRequestPayload } from "~/server/saveCliStatus";
import { api } from "~/ui/react";

export const saveCommand = async (files: Files, game: Game, auth: Auth) => {
  const saveDate = new Date().toISOString();
  const saveFileName = `dungeon_save_${saveDate}.json`;
  triggerDownload(saveFileName, files, game);

  if (auth.userInfo) {
    console.log("executing save");
    const result = await api.saveCli
      .useMutation()
      .mutateAsync({
        fileName: saveFileName,
        date: saveDate,
        files,
        game
      });
    console.log("save request result", result);
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