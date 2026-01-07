import { useEffect, useState } from "react";
import z from "zod";

export const filesStorageName = "files";

type Path = string;
type Content = string;

export const filesSchema = z.record(z.string(), z.string());
export type Files = z.infer<typeof filesSchema>;

const loadSavedFiles = () => {
  const savedFiles = localStorage.getItem(filesStorageName);
  if (!savedFiles) return {};

  const parsedFiles = z
    .record(z.string(), z.string())
    .safeParse(JSON.parse(savedFiles));
  return parsedFiles.data ?? {};
}

export const useFileSystem = () => {
  const [files, setFileSystem] = useState<Files>(loadSavedFiles());

  useEffect(
    () => localStorage.setItem(filesStorageName, JSON.stringify(files)), 
    [files]);

  return {
    writeFile: (path: Path, content: Content) => setFileSystem(prev => ({ ...prev, [path]: content })),
    readFile: (path: Path|undefined) => {
      if (!path) return "Usage: cat [file_path]";
      return !files[path] ? `File not found: ${path}` : files[path];
    },
    listAllFiles: () => Object.keys(files),
    files,
  };
};

export type FileSystem = ReturnType<typeof useFileSystem>;