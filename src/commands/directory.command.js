import { readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { FILESYSTEM_ELEMENTS } from "../constants/index.js";
import { InvalidInputException } from "../exceptions/index.js";
import { getHomeDirectory } from "./index.js";
import { checkDirectory, getFullPath } from "../helpers/index.js";

let currentDirectory;
export const getCurrentDirectory = () => currentDirectory;

export const showCurrentDirectory = () => {
  currentDirectory = currentDirectory || getHomeDirectory();
  console.log(`Current directory is ${currentDirectory}`);
};

export const updateCurrentDirectory = async (path) => {
  const newPath = await checkDirectory(path);
  currentDirectory = newPath;
};

const sortFoldersFirst = (list) => {
  const folders = [];
  const others = [];
  list.forEach((item) => {
    const { type } = item;
    const array = type === FILESYSTEM_ELEMENTS.directory ? folders : others;
    array.push(item);
  });
  return folders.concat(others);
};

const getContentType = async (path) => {
  try {
    const itemStat = await stat(path);
    if (itemStat.isFile()) return FILESYSTEM_ELEMENTS.file;
    if (itemStat.isDirectory()) return FILESYSTEM_ELEMENTS.directory;
    if (itemStat.isSymbolicLink()) return FILESYSTEM_ELEMENTS.symlink;
    if (itemStat.isFIFO()) return FILESYSTEM_ELEMENTS.fifo;
    if (itemStat.isSocket()) return FILESYSTEM_ELEMENTS.socket;
    if (itemStat.isBlockDevice()) return FILESYSTEM_ELEMENTS.blockDevice;
    if (itemStat.isCharacterDevice()) return FILESYSTEM_ELEMENTS.charDevice;
  } catch (e) {
    return FILESYSTEM_ELEMENTS.unknown;
  }
};

const showTable = (list) => {
  const data = list.map((item) => {
    const { name, type } = item;
    return {
      Name: name,
      Type: type,
    };
  });
  console.table(data);
};

export const up = async () => {
  const pathToDirectory = getFullPath("..");
  await updateCurrentDirectory(pathToDirectory);
};

export const cd = async ([path]) => {
  if (!path) throw new InvalidInputException(`Argument is not passed`);
  const pathToDirectory = getFullPath(path);
  await updateCurrentDirectory(pathToDirectory);
};

export const ls = async ([path]) => {
  const pathToDirectory = path ? getFullPath(path) : currentDirectory;

  await checkDirectory(pathToDirectory);
  const pathStat = await stat(pathToDirectory);
  if (!pathStat.isDirectory())
    throw new InvalidInputException(`Passed path '${path}' is not directory`);

  const contents = (await readdir(pathToDirectory)).sort();
  const promiseList = contents.map(async (content) => {
    const contentPath = resolve(pathToDirectory, content);
    const contentType = await getContentType(contentPath);
    return {
      name: content,
      type: contentType,
    };
  });

  const list = await Promise.all(promiseList);
  const sortedList = sortFoldersFirst(list);
  showTable(sortedList);
};
