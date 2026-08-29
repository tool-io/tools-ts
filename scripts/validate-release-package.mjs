import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
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

const packOutput = execFileSync(
  "npm",
  [
    "pack",
    "--dry-run",
    "--json",
    "--ignore-scripts",
    "--cache",
    path.join(tmpdir(), "tool-io-npm-cache"),
  ],
  {
    cwd: packageRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  },
);
const packResult = JSON.parse(packOutput)[0];
const packedFiles = new Set(
  (packResult?.files ?? []).map((entry) => entry.path),
);

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
    `Validated ${publicTools.length} packed tool subpaths across ${packedFiles.size} files; no package was created or published.\n`,
  );
}
