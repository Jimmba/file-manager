import { createReadStream, createWriteStream } from "fs";
import { createGzip, createGunzip } from "zlib";
import { dirname } from "node:path";

import { InvalidInputException } from "../exceptions/index.js";
import { checkDirectory, getFullPath } from "../helpers/index.js";

const compressionHandler = async (inputFile, outputFile, isCompress) => {
  if (!inputFile || !outputFile)
    throw new InvalidInputException(`Arguments is not passed correctly`);
  const pathToInputFile = getFullPath(inputFile);
  await checkDirectory(pathToInputFile);

  const pathToOutputFile = getFullPath(outputFile);
  const outputDirectory = dirname(pathToOutputFile);
  await checkDirectory(outputDirectory);
  if (pathToOutputFile === outputDirectory)
    throw new InvalidInputException("Destination filename is not passed");

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
