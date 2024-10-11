import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { InvalidInputException } from "../exceptions/index.js";
import { checkAccess, getFullPath } from "../helpers/index.js";

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
    throw new OperationFailedException(`Path ${pathToFile} not found`);
  const hashResult = await getFileHash(pathToFile);
  console.log(`Calculated hash: ${hashResult}`);
};
