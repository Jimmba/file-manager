import { Transform } from "node:stream";
import { getArgByKey } from "./helpers/index.js";
import { getFromOs, getHomeDirectory } from "./commands/index.js";

const userNameKey = "username";

const userName = getArgByKey(userNameKey);
console.log(`Welcome to the File Manager, ${userName}!`);

const currentDir = getHomeDirectory();

process.on("exit", () => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
});

const runCommand = (command, args) => {
  switch (command) {
    case "os":
      console.log("run command os");
      return getFromOs(args);
    default:
      throw new Error("Command not found"); // ! check error message
  }
};

const init = async () => {
  const transform = new Transform({
    transform(chunk, encoding, callback) {
      const input = chunk.toString().trim();
      const [command, ...args] = input.split(" ");

      try {
        runCommand(command, args);
      } catch (e) {
        console.error(e.message); // ! to log
      }

      // console.log("args", args);
      console.log(`Current directory is ${currentDir} \n`); // ! replace \n
      callback(null);
    },
  });

  process.stdin.pipe(transform).pipe(process.stdout);
};

await init();
