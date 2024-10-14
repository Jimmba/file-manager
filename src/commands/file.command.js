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

const readFileHandler = (filePath) => {
  return new Promise((res, rej) => {
    const stream = createReadStream(filePath);
    stream.on("end", () => {
      process.stdout.write("\n");
      res();
    });
    stream.on("error", (e) => {
      rej(new OperationFailedException(e.message));
    });
    stream.pipe(process.stdout);
  });
};

export const readFile = async ([path]) => {
  const filePath = getFullPath(path);
  if (!(await checkAccess(filePath)))
    throw new OperationFailedException(`Path '${path}' not found`);
  const isFile = await fileSystemElementType(
    filePath,
    FILESYSTEM_ELEMENTS.file
  );
  if (!isFile)
    throw new OperationFailedException(`Path '${path}' is not a file`);

  return readFileHandler(filePath);
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

  if (pathToOldFile === pathToNewFile)
    throw new InvalidInputException(`You entered the same filename`);
  const isNewFileExist = await checkAccess(pathToNewFile);
  console.log(pathToOldFile, " ====> ", pathToNewFile);

  if (isNewFileExist)
    throw new OperationFailedException(`File '${newFilePath}' already exists`);

  await rename(pathToOldFile, pathToNewFile);
  console.log(`Renamed: ${oldFileName} --> ${newFileName}`);
};

export const copyFileHandler = (
  fromPath,
  toPath,
  fullFromPath,
  fullToPath,
  isMove
) => {
  return new Promise((res, rej) => {
    const readStream = createReadStream(fullFromPath);
    readStream.on("error", (e) => {
      rej(new OperationFailedException(e.message));
    });

    const writeStream = createWriteStream(fullToPath);
    writeStream.on("error", (e) => {
      rej(new OperationFailedException(e.message));
    });
    writeStream.on("finish", () => {
      if (!isMove) console.log(`Copied: ${fromPath} --> ${toPath}`);
      res();
    });

    readStream.pipe(writeStream);
  });
};

export const copySingleFile = async ([fromPath, toPath], isMove = false) => {
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
    throw new OperationFailedException(`Path '${toPath} is not a directory'`);

  const fileName = basename(fullFromPath);
  const fullToPath = resolve(toPathDirectory, fileName);
  if (fullFromPath === fullToPath)
    throw new InvalidInputException(`You cannot copy a file to itself`);
  if (await checkAccess(fullToPath))
    throw new OperationFailedException(`File '${fileName}' already exists`);

  return copyFileHandler(fromPath, toPath, fullFromPath, fullToPath, isMove);
};

export const moveFile = async (args) => {
  const [fromPath, toPath] = args;
  const isMove = true;
  await copySingleFile(args, isMove);
  await removeFile(args, isMove);
  console.log(`File is moved: ${fromPath} --> ${toPath}`);
};

export const removeFile = async ([path], isMove = false) => {
  const filePath = getFullPath(path);
  const isFileExist = await checkAccess(filePath);
  if (!isFileExist)
    throw new OperationFailedException(`Path ${path} not found`);

  const isFile = await fileSystemElementType(
    filePath,
    FILESYSTEM_ELEMENTS.file
  );
  if (!isFile)
    throw new OperationFailedException(`Path '${path}' is not a file`);

  await rm(filePath);
  if (!isMove) console.log(`File '${path}' has been removed`);
};
