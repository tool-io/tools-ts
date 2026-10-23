import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { packageRoot, root } from "./package-build.mjs";

const source = path.join(packageRoot, "src");
const pending = [source];
const files = [];
while (pending.length) {
  const directory = pending.pop();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) pending.push(file);
    else if (/\.(?:spec|test)\.ts$/.test(entry.name)) files.push(file);
  }
}
if (!files.length) throw new Error("No unit-test files found.");
const manifest = JSON.parse(
  await readFile(path.join(packageRoot, "public-tools.generated.json"), "utf8"),
);
if (!manifest.tools.length)
  throw new Error("No public tools found for example conformance.");
const fileShards = Math.ceil((files.length - 2) / 1000);
const exampleShards = Math.ceil(manifest.tools.length / 1000);
const report = {
  schemaVersion: 1,
  testFiles: files.length,
  publicTools: manifest.tools.length,
  fileShards,
  exampleShards,
  steps: [],
  passed: false,
};
const reportFile = path.join(root, ".log/unit-batches.json");
await mkdir(path.dirname(reportFile), { recursive: true });
const save = () =>
  writeFile(reportFile, JSON.stringify(report, null, 2) + "\n");
const vitest = path.join(root, "node_modules/vitest/vitest.mjs");
const run = async (name, args, extraEnv = {}, workers = 2) => {
  report.activeStep = name;
  await save();
  console.log(`Unit batch: ${name}`);
  const start = performance.now();
  const code = await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [vitest, "run", `--maxWorkers=${workers}`, "--reporter=default", ...args],
      {
        cwd: packageRoot,
        env: {
          ...process.env,
          ...extraEnv,
          CI: "true",
          NO_COLOR: "1",
          FORCE_COLOR: "0",
        },
        stdio: "inherit",
      },
    );
    child.once("error", reject);
    child.once("close", resolve);
  });
  report.steps.push({
    name,
    code,
    seconds: (performance.now() - start) / 1000,
  });
  delete report.activeStep;
  await save();
  if (code !== 0) throw new Error(`Unit batch ${name} failed (${code}).`);
};
try {
  for (let index = 1; index <= fileShards; index++)
    await run(`files-${index}/${fileShards}`, [
      `--shard=${index}/${fileShards}`,
      "--exclude=src/architecture.spec.ts",
      "--exclude=src/example-conformance.spec.ts",
    ]);
  await run("architecture", ["src/architecture.spec.ts"], {}, 1);
  for (let index = 1; index <= exampleShards; index++)
    await run(
      `examples-${index}/${exampleShards}`,
      ["src/example-conformance.spec.ts"],
      { TOOLIO_EXAMPLE_SHARD: `${index}/${exampleShards}` },
      1,
    );
  report.passed = true;
} finally {
  await save();
}
console.log(
  `Passed all ${files.length} unit-test files and example conformance for ${manifest.tools.length} public tools.`,
);
