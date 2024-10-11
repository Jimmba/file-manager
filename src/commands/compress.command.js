import { createReadStream, createWriteStream } from "fs";
import { createGzip, createGunzip } from "zlib";
import { dirname } from "node:path";

import {
  InvalidInputException,
  OperationFailedException,
} from "../exceptions/index.js";
import { checkAccess, getFullPath } from "../helpers/index.js";

const compressionHandler = async (inputFile, outputFile, isCompress) => {
  if (!inputFile || !outputFile)
    throw new InvalidInputException(`Arguments passed incorrectly`);
  const pathToInputFile = getFullPath(inputFile);
  if (!(await checkAccess(pathToInputFile)))
    throw new OperationFailedException(`No access to file '${inputFile}'`);

  const pathToOutputFile = getFullPath(outputFile);
  if (await checkAccess(pathToOutputFile))
    throw new OperationFailedException(`File '${outputFile} already exists'`);

  const outputDirectory = dirname(pathToOutputFile);
  if (!(await checkAccess(outputDirectory)))
    throw new OperationFailedException(`No access to '${outputDirectory}'`);
  if (pathToOutputFile === outputDirectory)
    throw new InvalidInputException("Destination filename not passed");

  const readStream = createReadStream(pathToInputFile);
  const gzipStream = isCompress ? createGzip() : createGunzip();
  const writeStream = createWriteStream(pathToOutputFile);

  writeStream.on("error", (e) => {
    console.error(e.message);
  });

  writeStream.on("finish", () => {
    const operation = isCompress ? "Compressed" : "Decompressed";
    console.log(`${operation}: ${inputFile} --> ${outputFile}`);
  });
  readStream.pipe(gzipStream).pipe(writeStream);
};

export const compressFile = async ([inputFile, outputFile]) => {
  return compressionHandler(inputFile, outputFile, true);
};

export const decompressFile = async ([inputFile, outputFile]) => {
  return compressionHandler(inputFile, outputFile, false);
};
