import { getFullPath } from "./index.js";
import { getContentType } from "../commands/index.js";

export const fileSystemElementType = async (path, type) => {
  const pathToFile = getFullPath(path);
  const contentType = await getContentType(pathToFile);
  return contentType === type;
};
