import { gameSchema } from "@/game/model";
import { useFilePicker } from "use-file-picker"
import z from "zod";
import { filesSchema, filesStorageName } from "../fileSystem";
import { gameStorageName } from "@/game";

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