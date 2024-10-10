import { access } from "node:fs/promises";
import { resolve } from "node:path";

import { getCurrentDirectory } from "../commands/index.js";
import { OperationFailedException } from "../exceptions/index.js";

export const checkAccess = async (path) => {
  //? made public for checking if file exist (create new one)
  try {
    await access(resolve(path));
    return true;
  } catch (e) {
    return false;
  }
};

export const getFullPath = (path) => {
  const currentDirectory = getCurrentDirectory();
  return resolve(currentDirectory, path).toLowerCase();
};
