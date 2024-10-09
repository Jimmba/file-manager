const prefix = "--";
const splitter = "=";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const obj = {};
  args.forEach((arg) => {
    const [key, value] = arg.slice(prefix.length).split(splitter);
    obj[key] = value;
  });
  return obj;
};

export const getArgByKey = (key) => {
  const args = parseArgs();
  return args[key] || "unknown user";
};
