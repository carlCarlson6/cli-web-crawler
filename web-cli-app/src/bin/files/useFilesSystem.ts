"use client"
import { useEffect, useState } from "react";
import type { Files } from ".";
import { loadSavedFiles, saveFiles } from "~/ui/localStorage";

type Path = string;
type Content = string;

export const useFilesSystem = () => {
  const [files, setFileSystem] = useState<Files>(loadSavedFiles());

  useEffect(
    () => saveFiles(files), 
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

export type FileSystem = ReturnType<typeof useFilesSystem>;