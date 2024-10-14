import { Transform } from "node:stream";
import { getUsernameFromArgs } from "./helpers/index.js";
import {
  calculateHash,
  cd,
  compressFile,
  copySingleFile,
  createEmptyFile,
  decompressFile,
  getOsOptions,
  ls,
  moveFile,
  readFile,
  removeFile,
  renameFile,
  showCurrentDirectory,
  up,
} from "./commands/index.js";
import { InvalidInputException } from "./exceptions/index.js";

const commands = {
  os: getOsOptions,
  up: up,
  cd: cd,
  ls: ls,
  hash: calculateHash,
  compress: compressFile,
  decompress: decompressFile,
  cat: readFile,
  add: createEmptyFile,
  rn: renameFile,
  cp: copySingleFile,
  mv: moveFile,
  rm: removeFile,
};

const execCommand = (command, args) => {
  const runCommand = commands[command];
  if (!runCommand)
    throw new InvalidInputException(`Command \"${command}\" not found`);
  return runCommand(args);
};

const transform = new Transform({
  async transform(chunk, encoding, callback) {
    const input = chunk.toString().trim();
    const match = input.match(/"([^"]+)"|[^ ]+/g);
    const [command, ...args] = match.map((arg) => arg.replace(/"/g, ""));

    if (input === ".exit") {
      process.exit();
    }

    try {
      await execCommand(command, args);
    } catch (e) {
      console.error(e.message);
    }

    showCurrentDirectory();
    callback(null);
  },
});

const init = () => {
  console.log(`Welcome to the File Manager, ${getUsernameFromArgs()}!`);
  showCurrentDirectory();
  process.stdin.pipe(transform).pipe(process.stdout);

  process.on("exit", () => {
    console.log(
      `Thank you for using File Manager, ${getUsernameFromArgs()}, goodbye!`
    );
  });

  process.on("SIGINT", () => {
    process.exit();
  });
};

init();
