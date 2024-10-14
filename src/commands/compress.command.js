import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { dirname } from "node:path";

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

const streamCompressionHandler = (
  inputFile,
  outputFile,
  fullPathToInputFile,
  fullPathToOutputFile,
  isCompress
) => {
  return new Promise((res, rej) => {
    const readStream = createReadStream(fullPathToInputFile);
    const brotliStream = isCompress
      ? createBrotliCompress()
      : createBrotliDecompress();
    const writeStream = createWriteStream(fullPathToOutputFile);

    readStream.on("error", (e) => {
      rej(new OperationFailedException(e.message));
    });
    brotliStream.on("error", (e) => {
      rej(new OperationFailedException(e.message));
    });
    writeStream.on("error", (e) => {
      rej(new OperationFailedException(e.message));
    });

    writeStream.on("finish", () => {
      const operation = isCompress ? "Compressed" : "Decompressed";
      console.log(`${operation}: ${inputFile} --> ${outputFile}`);
      res();
    });
    readStream.pipe(brotliStream).pipe(writeStream);
  });
};

const compressionHandler = async (inputFile, outputFile, isCompress) => {
  if (!inputFile || !outputFile)
    throw new InvalidInputException(`Arguments passed incorrectly`);
  const pathToInputFile = getFullPath(inputFile);
  if (!(await checkAccess(pathToInputFile)))
    throw new OperationFailedException(`No access to file '${inputFile}'`);

  const isFile = await fileSystemElementType(
    pathToInputFile,
    FILESYSTEM_ELEMENTS.file
  );
  if (!isFile)
    throw new OperationFailedException(`Path '${inputFile}' not a file`);

  const pathToOutputFile = getFullPath(outputFile);
  if (await checkAccess(pathToOutputFile))
    throw new OperationFailedException(`File '${outputFile} already exists'`);

  const outputDirectory = dirname(pathToOutputFile);
  if (!(await checkAccess(outputDirectory)))
    throw new OperationFailedException(`No access to '${outputDirectory}'`);
  if (pathToOutputFile === outputDirectory)
    throw new InvalidInputException("Destination filename not passed");
  return streamCompressionHandler(
    inputFile,
    outputFile,
    pathToInputFile,
    pathToOutputFile,
    isCompress
  );
};

export const compressFile = async ([inputFile, outputFile]) => {
  return compressionHandler(inputFile, outputFile, true);
};

export const decompressFile = async ([inputFile, outputFile]) => {
  return compressionHandler(inputFile, outputFile, false);
};
