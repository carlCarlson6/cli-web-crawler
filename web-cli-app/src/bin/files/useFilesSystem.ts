"use client"
import { useEffect, useState } from "react";
import type { Files } from ".";
import { filesStorageName, loadSavedFiles, saveFiles } from "~/ui/localStorage";

type Path = string;
type Content = string;
type File = { path: Path, content: Content }

export const useFilesSystem = () => {
  const [files, setFileSystem] = useState<Files>({});

  useEffect(
    () => {
      const savedFiles = loadSavedFiles();
      localStorage.setItem(filesStorageName, JSON.stringify(savedFiles))
    }, 
    []);

  return {
    writeFile: (path: Path, content: Content) => {
      saveFiles({ ...files, [path]: content });
      setFileSystem(prev => ({ ...prev, [path]: content }));
    },
    readFile: (path: Path|undefined) => {
      if (!path) return "Usage: cat [file_path]";
      return !files[path] ? `File not found: ${path}` : files[path];
    },
    listAllFiles: () => Object.keys(files),
    files,
  };
};

export type FileSystem = ReturnType<typeof useFilesSystem>;