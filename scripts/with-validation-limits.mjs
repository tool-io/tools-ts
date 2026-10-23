import { spawn, execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  parseLimitedArguments,
  readValidationLimits,
} from "./validation-limits.mjs";

const execute = promisify(execFile);
const script = fileURLToPath(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const inside = args[0] === "--inside";
const reportFile = inside ? args[1] : undefined;
const options = parseLimitedArguments(inside ? args.slice(2) : args);
if (process.platform !== "linux")
  throw new Error(
    "This guard requires Linux cgroup v2 and a user systemd service. No unbounded fallback is run.",
  );

const run = (command, arguments_, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, arguments_, { cwd, stdio: "inherit" });
    child.once("error", reject);
    child.once("close", (code, signal) => resolve({ code, signal }));
  });

if (inside) {
  const limits = await readValidationLimits(options);
  const report = JSON.parse(await readFile(reportFile, "utf8"));
  report.enforced = limits;
  await writeFile(reportFile, JSON.stringify(report, null, 2) + "\n");
  console.log(
    `Enforced validation limits: ${limits.memoryMaxBytes / 1024 / 1024} MiB RAM, 0 swap, ${limits.tasksMax} tasks.`,
  );
  const started = performance.now();
  const result = await run(
    options.command[0],
    options.command.slice(1),
    process.cwd(),
  );
  report.commandResult = result;
  report.seconds = (performance.now() - started) / 1000;
  report.peakMemoryBytes = Number(
    (await readFile(path.join(limits.directory, "memory.peak"), "utf8")).trim(),
  );
  report.memoryEvents = (
    await readFile(path.join(limits.directory, "memory.events"), "utf8")
  ).trim();
  await writeFile(reportFile, JSON.stringify(report, null, 2) + "\n");
  process.exitCode = result.code ?? 1;
} else {
  const unit = `toolio-validation-${process.pid}-${Date.now()}.service`;
  const reports = path.join(root, ".log/validation-limits");
  await mkdir(reports, { recursive: true });
  const target = path.join(reports, `${unit}.json`);
  await writeFile(
    target,
    JSON.stringify(
      {
        schemaVersion: 1,
        unit,
        startedAt: new Date().toISOString(),
        cwd: process.cwd(),
        options,
        passed: false,
      },
      null,
      2,
    ) + "\n",
  );
  let interrupted = false;
  const stop = async () => {
    interrupted = true;
    await execute("systemctl", ["--user", "stop", unit]).catch(() => {});
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  let result;
  try {
    result = await run(
      "systemd-run",
      [
        "--user",
        "--quiet",
        "--wait",
        "--pipe",
        `--unit=${unit}`,
        `--working-directory=${process.cwd()}`,
        `--property=MemoryMax=${options.memoryMiB}M`,
        "--property=MemorySwapMax=0",
        "--property=TasksMax=256",
        "--property=CPUQuota=200%",
        "--property=OOMPolicy=kill",
        `--property=RuntimeMaxSec=${options.seconds}s`,
        `--setenv=PATH=${process.env.PATH ?? "/usr/bin:/bin"}`,
        "--setenv=GOMAXPROCS=2",
        `--setenv=GOMEMLIMIT=${Math.max(32, Math.floor(options.memoryMiB * 0.7))}MiB`,
        `--setenv=NODE_OPTIONS=--max-old-space-size=${Math.max(32, Math.floor(options.memoryMiB * 0.7))}`,
        ...(process.env.CI ? [`--setenv=CI=${process.env.CI}`] : []),
        "--",
        process.execPath,
        script,
        "--inside",
        target,
        ...args,
      ],
      root,
    );
  } finally {
    const report = JSON.parse(await readFile(target, "utf8"));
    report.launcherResult = result;
    report.interrupted = interrupted;
    report.passed =
      !interrupted && result?.code === 0 && Boolean(report.enforced);
    const state = await execute(
      "systemctl",
      ["--user", "show", unit, "--property=Result,MemoryPeak,MemorySwapPeak"],
      { maxBuffer: 4096 },
    ).catch(() => undefined);
    if (state?.stdout) report.unitState = state.stdout.trim();
    await writeFile(target, JSON.stringify(report, null, 2) + "\n");
    await execute("systemctl", ["--user", "reset-failed", unit]).catch(
      () => {},
    );
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
    console.log(`Validation report: ${target}`);
    if (report.peakMemoryBytes)
      console.log(
        `Peak cgroup memory: ${(report.peakMemoryBytes / 1024 / 1024).toFixed(1)} MiB.`,
      );
    process.exitCode = report.passed ? 0 : result?.code || 1;
  }
}
