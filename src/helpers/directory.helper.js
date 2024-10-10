import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { getCurrentDirectory } from "../commands/index.js";

const checkAccess = async (path) => {
  try {
    await access(resolve(path));
    return true;
  } catch (e) {
    return false;
  }
};

export const checkDirectory = async (path) => {
  const modifiedPath = path.toLowerCase();
  const isPathAccessible = await checkAccess(modifiedPath);
  if (!isPathAccessible)
    throw new InvalidInputException(`Path '${path}' is not exist`); // ! OperationFailedException ?
  return modifiedPath;
};

export const getFullPath = (path) => {
  const currentDirectory = getCurrentDirectory();
  return resolve(currentDirectory, path);
};
