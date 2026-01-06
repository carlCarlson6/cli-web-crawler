import { useEffect, useState } from "react";
import z from "zod";

type Path = string;
type Content = string;
export type Files = Record<Path, Content>;

const loadSavedFiles = () => {
  const savedFiles = localStorage.getItem("files");
  if (!savedFiles) return {};

  const parsedFiles = z
    .record(z.string(), z.string())
    .safeParse(JSON.parse(savedFiles));
  return parsedFiles.data ?? {};
}

export const useFileSystem = () => {
  const [files, setFileSystem] = useState<Files>(loadSavedFiles());

  useEffect(
    () => localStorage.setItem("files", JSON.stringify(files)), 
    [files]);

  return {
    writeFile: (path: Path, content: Content) => setFileSystem(prev => ({ ...prev, [path]: content })),
    readFile: (path: Path|undefined) => {
      if (!path) return "Usage: cat [file_path]";
      return files[path] ? `File not found: ${path}` : files[path];
    },
    listAllFiles: () => Object.keys(files),
    files,
  };
};

export type FileSystem = ReturnType<typeof useFileSystem>;