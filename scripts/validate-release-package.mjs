import { spawn } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const packageRoot = path.join(root, "packages/tools");
const manifest = JSON.parse(
  await readFile(path.join(packageRoot, "package.json"), "utf8"),
);
const publicTools = JSON.parse(
  await readFile(path.join(packageRoot, "public-tools.generated.json"), "utf8"),
).tools;
const failures = [];

const capture = (command, arguments_, options = {}, requireOutput = true) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, arguments_, {
      ...options,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout = [];
    const stderr = [];
    let stdoutBytes = 0;
    const maximumOutputBytes = 64 * 1024 * 1024;
    child.stdout.on("data", (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes > maximumOutputBytes) {
        child.kill();
        reject(
          new Error(
            `${command} output exceeded ${maximumOutputBytes} bytes.`,
          ),
        );
        return;
      }
      stdout.push(chunk);
    });
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.once("error", reject);
    child.once("close", (code, signal) => {
      const diagnostics = Buffer.concat(stderr).toString("utf8").trim();
      if (code !== 0) {
        reject(
          new Error(
            `${command} failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}${diagnostics ? `:\n${diagnostics}` : ""}`,
          ),
        );
        return;
      }
      const output = Buffer.concat(stdout).toString("utf8");
      if (requireOutput && !output.trim()) {
        reject(
          new Error(
            `${command} returned no package metadata${diagnostics ? `:\n${diagnostics}` : ""}`,
          ),
        );
        return;
      }
      resolve(output);
    });
  });

if (manifest.name !== "@tool.io/tools")
  failures.push("Package name must remain @tool.io/tools.");
if (manifest.private !== false)
  failures.push("The tools package must be eligible for an eventual release.");
if (manifest.license !== "MIT") failures.push("Package license must be MIT.");
if (manifest.sideEffects !== false)
  failures.push("Package must declare sideEffects: false for tree-shaking.");
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version ?? ""))
  failures.push("Package version must use semantic versioning.");

const wildcardExport = manifest.exports?.["./*"];
if (
  wildcardExport?.types !== "./dist/*/index.d.ts" ||
  wildcardExport?.import !== "./dist/*/index.js"
)
  failures.push("The wildcard tool subpath export is missing or invalid.");

const exportTargets = [];
const collectExportTargets = (value) => {
  if (typeof value === "string") exportTargets.push(value);
  else if (value && typeof value === "object")
    for (const child of Object.values(value)) collectExportTargets(child);
};
collectExportTargets(manifest.exports);
for (const target of exportTargets.filter((entry) => !entry.includes("*"))) {
  try {
    await access(path.join(packageRoot, target));
  } catch {
    failures.push(`Export target ${target} does not exist.`);
  }
}

const packDirectory = await mkdtemp(path.join(tmpdir(), "tool-io-pack-"));
let packedFiles;
try {
  await capture(
    "npm",
    [
      "pack",
      "--ignore-scripts",
      "--pack-destination",
      packDirectory,
      "--cache",
      path.join(tmpdir(), "tool-io-npm-cache"),
    ],
    { cwd: packageRoot },
    false,
  );
  const archives = (await readdir(packDirectory)).filter((name) =>
    name.endsWith(".tgz"),
  );
  if (archives.length !== 1)
    throw new Error(
      `npm pack created ${archives.length} archives instead of exactly one.`,
    );
  const listing = await capture("tar", [
    "-tzf",
    path.join(packDirectory, archives[0]),
  ]);
  packedFiles = new Set(
    listing
      .split("\n")
      .filter(Boolean)
      .map((entry) => entry.replace(/^package\//, "")),
  );
} finally {
  await rm(packDirectory, { force: true, recursive: true });
}

for (const required of [
  "LICENSE",
  "README.md",
  "catalog.generated.json",
  "contracts.generated.json",
  "package.json",
  "tool-contract.schema.json",
])
  if (!packedFiles.has(required)) failures.push(`${required} is not packed.`);

for (const id of publicTools) {
  for (const extension of ["js", "d.ts"])
    if (!packedFiles.has(`dist/${id}/index.${extension}`))
      failures.push(`${id} is missing its packed ${extension} entry point.`);
}

for (const file of packedFiles)
  if (
    file.startsWith("src/") ||
    /(?:^|\/)(?:[^/]+\.)?(?:spec|test)\.[cm]?[jt]sx?$/.test(file) ||
    file.endsWith(".tsbuildinfo")
  )
    failures.push(`Development-only file ${file} would be published.`);

if (failures.length > 0) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Validated ${publicTools.length} packed tool subpaths across ${packedFiles.size} files; no package was retained or published.\n`,
  );
}
