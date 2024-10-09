import os from "node:os";
const commandPrefix = "--";

export const getFromOs = ([arg]) => {
  const command = arg.slice(commandPrefix.length);
  console.warn("os command", command); // ! remove console
  const runCommand = osCommands[command];
  if (!runCommand) throw new Error("Os command not found");
  runCommand();
};

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

export const getHomeDirectory = () => os.homedir();

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

const osCommands = {
  EOL: showEOL,
  cpus: showCpuData,
  homedir: showHomeDirectory,
  userName: showUserName,
  architecture: showArch,
};
