import { Transform } from "node:stream";
import { getUsernameFromArgs } from "./helpers/index.js";
import {
  getOsOptions,
  showCurrentDirectory,
  cd,
  ls,
  up,
  calculateHash,
} from "./commands/index.js";
import { InvalidInputException } from "./exceptions/index.js";

const commands = {
  os: getOsOptions,
  up: up,
  cd: cd,
  ls: ls,
};

const execCommand = async (command, args) => {
  //! rename?
  const runCommand = commands[command];
  if (!runCommand)
    throw new InvalidInputException(`Command \"${command}\" not found`);
  await runCommand(args);
};

const transform = new Transform({
  async transform(chunk, encoding, callback) {
    const input = chunk.toString().trim();
    const [command, ...args] = input.split(" ");

    try {
      await execCommand(command, args);
    } catch (e) {
      console.error(e.message);
    }

    showCurrentDirectory();
    callback(null);
  },
});

process.on("exit", () => {
  //! fix
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
});

const init = () => {
  console.log(`Welcome to the File Manager, ${getUsernameFromArgs()}!`);
  showCurrentDirectory();
  process.stdin.pipe(transform).pipe(process.stdout);
};

init();
