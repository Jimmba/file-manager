import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
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

const getFileHash = (filePath) => {
  return new Promise((res, rej) => {
    const hash = createHash("sha256");
    const input = createReadStream(filePath);

    input.on("data", (chunk) => {
      hash.update(chunk);
    });

    input.on("end", () => {
      const resultHash = hash.digest("hex");
      res(resultHash);
    });

    input.on("error", (err) => {
      rej(err);
    });
  });
};

export const calculateHash = async ([path]) => {
  if (!path) throw new InvalidInputException(`Argument not passed`);
  const pathToFile = getFullPath(path);
  if (!(await checkAccess(pathToFile)))
    throw new OperationFailedException(`Path '${path}' not found`);
  const isFile = await fileSystemElementType(
    pathToFile,
    FILESYSTEM_ELEMENTS.file
  );

  if (!isFile) throw new OperationFailedException(`Path '${path}' not a file`);
  const hashResult = await getFileHash(pathToFile);
  console.log(`Calculated hash: ${hashResult}`);
};
