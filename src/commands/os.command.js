import os from "node:os";
import { InvalidInputException } from "../exceptions/index.js";

const showEOL = () => {
  const eol = os.EOL;
  console.log(`Default system End-Of-Line is: ${JSON.stringify(eol)}`);
};

const showCpuData = () => {
  const cpus = os.cpus();
  console.log(`Total number of CPUs: ${cpus.length}`);

  cpus.forEach((cpu, index) => {
    const { model, speed } = cpu;
    const speedInGHz = (speed / 1000).toFixed(2);
    console.log(
      `CPU ${index + 1}: Model: ${model}, Clock rate: ${speedInGHz} GHz`
    );
  });
};

export const getHomeDirectory = () => os.homedir().toLowerCase();

const showHomeDirectory = () => {
  console.log(`Home directory: ${getHomeDirectory()}`);
};

const showUserName = () => {
  const { username } = os.userInfo();
  console.log(`Username: ${username}`);
};

const showArch = () => {
  const cpuArch = os.arch();
  console.log(`CPU Architecture: ${cpuArch}`);
};

const options = {
  EOL: showEOL,
  cpus: showCpuData,
  homedir: showHomeDirectory,
  userName: showUserName,
  architecture: showArch,
};

export const getOsOptions = async ([arg]) => {
  return new Promise((res, rej) => {
    if (!arg) rej(new InvalidInputException(`OS arguments is not passed`));

    const optionPrefix = "--";
    const option = arg.slice(optionPrefix.length);
    const runOption = options[option];
    if (!runOption)
      rej(new InvalidInputException(`OS argument '${arg}' not found`));
    res(runOption());
  });
};
