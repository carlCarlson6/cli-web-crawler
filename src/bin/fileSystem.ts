import { useEffect, useState } from "react";
import z from "zod";

type Path = string;
type Content = string;
type Files = Record<Path, Content>;

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
    readFile: (path: Path) => files[path] || null,
    files: Object.keys(files),
  };
};

export type FileSystem = ReturnType<typeof useFileSystem>;