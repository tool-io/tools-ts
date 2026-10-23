import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { capture, root } from "./package-build.mjs";

const args = process.argv.slice(2);
if (
  args.some(
    (arg, i) =>
      ![
        "--working-tree",
        "--full-tests",
        "--source-only",
        "--keep",
        "--runtime",
        "--output",
      ].includes(arg) && !["--runtime", "--output"].includes(args[i - 1]),
  )
)
  throw new Error(
    "Usage: verify-checkout.mjs [--working-tree] [--source-only] [--full-tests] [--keep] [--runtime /path/to/node] [--output report.json]",
  );
const values = (name) =>
  args.flatMap((arg, i) => {
    if (arg !== name) return [];
    if (!args[i + 1] || args[i + 1].startsWith("--"))
      throw new Error(`${name} needs a value.`);
    return [args[i + 1]];
  });
const runtimes = values("--runtime").map((runtime) => path.resolve(runtime));
const target = values("--output")[0];
await mkdir(path.join(root, ".log"), { recursive: true });
// A separate source export, not a worktree and never a commit. No ignored cache is copied.
const temporary = await mkdtemp(path.join(root, ".log/clean-checkout-"));
const checkout = path.join(temporary, "source");
const report = {
  schemaVersion: 1,
  node: process.version,
  revision: (await capture("git", ["rev-parse", "HEAD"], { cwd: root })).trim(),
  workingTree: args.includes("--working-tree"),
  scope: args.includes("--source-only")
    ? "github-source"
    : "source-and-npm-package",
  steps: [],
  checkout,
};
const saveReport = async () => {
  if (!target) return;
  await mkdir(path.dirname(path.resolve(target)), { recursive: true });
  await writeFile(target, JSON.stringify(report, null, 2) + "\n");
};
await saveReport();
let passed = false;
try {
  let tree = "HEAD";
  if (report.workingTree) {
    const env = {
      ...process.env,
      GIT_INDEX_FILE: path.join(temporary, "candidate-index"),
    };
    await capture("git", ["read-tree", "HEAD"], { cwd: root, env });
    await capture("git", ["add", "--all", "--", "."], {
      cwd: root,
      env,
    });
    tree = (await capture("git", ["write-tree"], { cwd: root, env })).trim();
  }
  report.tree = tree;
  await saveReport();
  await mkdir(checkout);
  const archive = path.join(temporary, "source.tar");
  await capture(
    "git",
    ["archive", "--format=tar", `--output=${archive}`, tree],
    { cwd: root },
  );
  await capture("tar", ["-xf", archive, "-C", checkout]);
  await rm(archive);
  // Prevent commands from accidentally discovering the enclosing development repository.
  await capture("git", ["init", "--quiet"], { cwd: checkout });
  const env = {
    ...process.env,
    PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH}`,
    CI: "true",
  };
  const run = async (name, command, arguments_) => {
    const log = path.join(temporary, `${report.steps.length + 1}-${name}.log`);
    process.stdout.write(`Clean checkout: ${name}\n`);
    report.activeStep = name;
    await saveReport();
    const start = performance.now();
    const stream = createWriteStream(log);
    const code = await new Promise((resolve, reject) => {
      const child = spawn(command, arguments_, {
        cwd: checkout,
        env,
        stdio: ["ignore", "pipe", "pipe"],
      });
      child.stdout.pipe(stream, { end: false });
      child.stderr.pipe(stream, { end: false });
      child.once("error", reject);
      child.once("close", resolve);
    });
    await new Promise((resolve) => stream.end(resolve));
    report.steps.push({
      name,
      code,
      seconds: (performance.now() - start) / 1000,
      log,
    });
    delete report.activeStep;
    await saveReport();
    if (code !== 0) throw new Error(`${name} failed (${code}). See ${log}`);
  };
  await run("frozen-install", "pnpm", [
    "install",
    "--frozen-lockfile",
    "--ignore-scripts",
    "--offline",
  ]);
  await run("script-tests", process.execPath, [
    "--test",
    "--test-concurrency=1",
    "scripts/implementation-dates.test.mjs",
    "scripts/contract-schema-validation.test.mjs",
    "scripts/portable-schema-validation.test.mjs",
    "scripts/tabular-schema-validation.test.mjs",
    "scripts/package-build.test.mjs",
    "scripts/release-version.test.mjs",
    "scripts/example-metadata.test.mjs",
    "scripts/audit-history.test.mjs",
    "scripts/validation-limits.test.mjs",
    "scripts/compiler-batches.test.mjs",
    "scripts/unit-batches.test.mjs",
  ]);
  await run("types", "pnpm", ["check"]);
  await run("generated-build", process.execPath, [
    "scripts/build-package.mjs",
    "--check",
  ]);
  await run("contracts-examples", process.execPath, [
    "scripts/validate-package.mjs",
  ]);
  await run("independent-references", process.execPath, [
    "scripts/check-reference-vectors.mjs",
  ]);
  await run("browser-boundary", process.execPath, [
    "scripts/verify-browser.mjs",
  ]);
  if (!args.includes("--source-only"))
    await run("packed-consumers", process.execPath, [
      "scripts/validate-release-package.mjs",
      ...runtimes.flatMap((runtime) => ["--runtime", runtime]),
    ]);
  // Fail fast on package/schema errors before spending time on the complete suite.
  if (args.includes("--full-tests"))
    await run("unit-tests", "pnpm", ["test:unit"]);
  else
    await run("scoped-tests", "pnpm", [
      "--filter",
      "@tool.io/tools",
      "exec",
      "vitest",
      "run",
      "src/architecture.spec.ts",
      "src/discovery.spec.ts",
      "src/core/contract.spec.ts",
      "src/core/simple.spec.ts",
      "src/core/discovery-ranking.spec.ts",
      "src/nullable-results.spec.ts",
      "src/random/exercise-schema.spec.ts",
      "--maxWorkers=2",
    ]);
  passed = true;
} finally {
  report.passed = passed;
  await saveReport();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (passed && !args.includes("--keep"))
    await rm(temporary, { recursive: true, force: true });
}
