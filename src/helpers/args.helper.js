import { ARGS_PARAMETERS } from "../constants/index.js";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const obj = {};
  args.forEach((arg) => {
    const [key, value] = arg
      .slice(ARGS_PARAMETERS.prefix.length)
      .split(ARGS_PARAMETERS.splitter);
    obj[key] = value;
  });
  return obj;
};

export const getUsernameFromArgs = () => {
  const args = parseArgs();
  return args[ARGS_PARAMETERS.usernameKey] || ARGS_PARAMETERS.defaultUser;
};
