"use client"
import { useFilePicker } from "use-file-picker"
import z from "zod";
import { gameSchema } from "~/game";
import { filesSchema } from "../files";
import { setLoadCliState } from "~/ui/localStorage";

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
      }).safeParse(JSON.parse(filesContent[0]?.content ?? ""));
      if (!result.success) return console.error("failed to load");

      setLoadCliState(result.data.game, result.data.files)
      window.location.reload();
    },
  });

  return {
    selectFile: openFilePicker
  }
}