import { useFilePicker } from "use-file-picker"
import z from "zod";
import { gameStorageName } from "@/game";
import { gameSchema } from "cli-contracts/game";
import { filesSchema } from "cli-contracts/files";
import { filesStorageName } from "../fileSystem";

export const useLoad = () => {
  const { openFilePicker } = useFilePicker({
    accept: ".json",
    multiple: false,
    readAs: "Text",
    onFilesSuccessfullySelected: ({ filesContent }) => {
      // this callback is called when there were no validation errors
      const result = z.object({
        game: gameSchema,
        files: filesSchema
      }).safeParse(JSON.parse(filesContent[0].content));
      if (!result.success) return console.error("failed to load");

      localStorage.setItem(filesStorageName, JSON.stringify(result.data.files));
      localStorage.setItem(gameStorageName, JSON.stringify(result.data.game));
      window.location.reload();
    },
  });

  return {
    selectFile: openFilePicker
  }
}