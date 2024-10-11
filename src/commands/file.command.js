import { createReadStream, createWriteStream } from "node:fs";
import { rename, writeFile, rm } from "node:fs/promises";
import { basename, dirname, resolve, extname } from "node:path";
import {
  InvalidInputException,
  OperationFailedException,
} from "../exceptions/index.js";
import {
  checkAccess,
  fileSystemElementType,
  getFullPath,
} from "../helpers/index.js";
import { FILESYSTEM_ELEMENTS } from "../constants/filesystem_elements.constant.js";

export const readFile = async ([path]) => {
  const filePath = getFullPath(path);
  if (!(await checkAccess(filePath)))
    throw new OperationFailedException(`Path '${path}' not found`);
  const isFile = await fileSystemElementType(
    filePath,
    FILESYSTEM_ELEMENTS.file
  );
  if (!isFile) throw new InvalidInputException(`Path '${path}' is not a file`);

  const stream = createReadStream(filePath);
  stream.on("end", () => {
    process.stdout.write("\n");
  });
  stream.on("error", (e) => {
    console.log(e);
  });
  stream.pipe(process.stdout);
};

export const createEmptyFile = async ([path]) => {
  const filePath = getFullPath(path);
  const isFileExist = await checkAccess(filePath);
  if (isFileExist)
    throw new OperationFailedException(`File '${path}' already exist`);
  const directory = dirname(filePath);
  if (!(await checkAccess(directory)))
    throw new OperationFailedException(`Path '${directory}' not found`);

  await writeFile(filePath, "");
  console.log("File has been created successfully!");
};

export const renameFile = async ([oldFilePath, newFilePath]) => {
  if (!oldFilePath || !newFilePath || !extname(newFilePath))
    throw new InvalidInputException(`Arguments passed incorrectly`);

  const pathToOldFile = getFullPath(oldFilePath);
  if (!(await checkAccess(pathToOldFile)))
    throw new OperationFailedException(`Path ${oldFilePath} not found`);
  const oldFileDirectory = dirname(pathToOldFile);
  const oldFileName = basename(getFullPath(pathToOldFile));

  const newFileName = basename(getFullPath(newFilePath));
  const pathToNewFile = resolve(oldFileDirectory, newFileName);
  console.log(newFilePath);

  if (pathToOldFile === pathToNewFile)
    throw new InvalidInputException(`Filename is not changed`);
  const isNewFileExist = await checkAccess(pathToNewFile);
  console.log(pathToOldFile, " ====> ", pathToNewFile);

  if (isNewFileExist)
    throw new OperationFailedException(`File '${newFilePath}' already exists`);

  await rename(pathToOldFile, pathToNewFile);
  console.log(`Renamed: ${oldFileName} --> ${newFileName}`);
};

export const copySingleFile = async ([fromPath, toPath], isMove = false) => {
  console.log("here");
  if (!fromPath || !toPath)
    throw new InvalidInputException("Arguments passed incorectly");
  const fullFromPath = getFullPath(fromPath);
  if (!(await checkAccess(fullFromPath)))
    throw new OperationFailedException(`Path '${fromPath}' not found`);

  const isFile = await fileSystemElementType(
    fullFromPath,
    FILESYSTEM_ELEMENTS.file
  );
  if (!isFile)
    throw new OperationFailedException(`Path '${fromPath}' is not a file`);

  const toPathDirectory = getFullPath(toPath);
  if (!(await checkAccess(toPathDirectory)))
    throw new OperationFailedException(`Path '${toPath}' not found`);

  const toPathIsDirectory = await fileSystemElementType(
    toPathDirectory,
    FILESYSTEM_ELEMENTS.directory
  );
  if (!toPathIsDirectory)
    throw new OperationFailedException(`Path '${toPath} is not directory'`);

  const fileName = basename(fullFromPath);
  const fullToPath = resolve(toPathDirectory, fileName);
  if (fullFromPath === fullToPath)
    throw new InvalidInputException(`Passed path the same`);
  if (await checkAccess(fullToPath))
    throw new OperationFailedException(`File '${fileName}' already exists`);

  const readStream = createReadStream(fullFromPath);
  readStream.on("error", (e) => {
    console.log(e);
  });

  const writeStream = createWriteStream(fullToPath);
  writeStream.on("error", (e) => {
    console.log(e);
  });
  writeStream.on("finish", () => {
    if (!isMove) console.log(`Copied: ${fromPath} --> ${toPath}`);
  });

  readStream.pipe(writeStream);
};

export const moveFile = async (args) => {
  const [fromPath, toPath] = args;
  const isMove = true;
  await copySingleFile(args, isMove);
  await removeFile(args);
  console.log(`Moved: ${fromPath} --> ${toPath}`);
};

export const removeFile = async ([path], isMove = false) => {
  const filePath = getFullPath(path);
  console.log(filePath);
  const isFileExist = await checkAccess(filePath);
  if (!isFileExist)
    throw new OperationFailedException(`Path ${path} not found`);

  await rm(filePath);
  if (!isMove) console.log(`File '${path}' has been removed`);
};
