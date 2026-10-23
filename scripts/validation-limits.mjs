import { readFile } from "node:fs/promises";
import path from "node:path";

export const parseLimitedArguments = (args) => {
  const result = { memoryMiB: 4096, seconds: 1800, command: [] };
  let index = 0;
  for (; index < args.length && args[index] !== "--"; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (!["--memory-mib", "--time-seconds"].includes(option))
      throw new Error(`Unknown validation limit option: ${option}`);
    if (!value || !/^\d+$/.test(value))
      throw new Error(`${option} requires an integer.`);
    if (option === "--memory-mib") result.memoryMiB = Number(value);
    else result.seconds = Number(value);
  }
  if (result.memoryMiB < 64 || result.memoryMiB > 6144)
    throw new Error("Validation RAM must be between 64 and 6144 MiB.");
  if (result.seconds < 1 || result.seconds > 7200)
    throw new Error("Validation timeout must be between 1 and 7200 seconds.");
  if (args[index] !== "--" || !args[index + 1])
    throw new Error(
      "Usage: with-validation-limits.mjs [--memory-mib 4096] [--time-seconds 1800] -- command [arguments]",
    );
  result.command = args.slice(index + 1);
  return result;
};

// Fail closed before spawning the requested command. Soft runtime settings do
// not establish a resource boundary for a compiler or its subprocesses.
export const readValidationLimits = async ({
  memoryMiB,
  procFile = "/proc/self/cgroup",
  cgroupRoot = "/sys/fs/cgroup",
}) => {
  const membership = await readFile(procFile, "utf8");
  const group = membership
    .split("\n")
    .find((line) => line.startsWith("0::"))
    ?.slice(3);
  if (!group?.startsWith("/") || group.split("/").includes(".."))
    throw new Error("A cgroup v2 memory boundary is required.");
  const directory = path.join(cgroupRoot, group);
  const memoryMax = (
    await readFile(path.join(directory, "memory.max"), "utf8")
  ).trim();
  const swapMax = (
    await readFile(path.join(directory, "memory.swap.max"), "utf8")
  ).trim();
  const tasksMax = (
    await readFile(path.join(directory, "pids.max"), "utf8")
  ).trim();
  if (
    !/^\d+$/.test(memoryMax) ||
    BigInt(memoryMax) > BigInt(memoryMiB) * 1024n * 1024n
  )
    throw new Error(
      "The requested hard RAM limit is not enforced; command refused.",
    );
  if (swapMax !== "0")
    throw new Error("Zero swap is not enforced; command refused.");
  if (!/^\d+$/.test(tasksMax) || Number(tasksMax) > 256)
    throw new Error(
      "The validation task limit is not enforced; command refused.",
    );
  return {
    directory,
    memoryMaxBytes: Number(memoryMax),
    swapMaxBytes: 0,
    tasksMax: Number(tasksMax),
  };
};
