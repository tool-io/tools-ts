import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  resolveImplementationDates,
  unknownImplementationDate,
} from "./implementation-dates.mjs";

const root = path.resolve(import.meta.dirname, "..");
const packageRoot = path.join(root, "packages/tools");
const manifest = JSON.parse(
  await readFile(path.join(packageRoot, "public-tools.generated.json"), "utf8"),
);
const { createToolCatalogEntry, toolCatalogSource } = await import(
  path.join(packageRoot, "dist/core/catalog.js")
);
const { portableToolContract } = await import(
  path.join(packageRoot, "dist/core/portable-contract.js")
);
const { validateToolContract } = await import(
  path.join(packageRoot, "dist/core/contract.js")
);
const committed = path.join(packageRoot, "catalog.generated.json");
const previousCatalog = JSON.parse(
  await readFile(committed, "utf8").catch(() => '{"entries":[]}'),
);
const previousDates = new Map(
  (previousCatalog.entries ?? []).map((entry) => [
    entry.id,
    entry.implementedAt,
  ]),
);
const runGit = (arguments_) =>
  execFileSync("git", arguments_, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  });
const implementationDates = resolveImplementationDates({
  directories: manifest.tools,
  previousDates,
  runGit,
});
const entries = [];
const contracts = [];
for (const directory of manifest.tools) {
  const module = await import(
    path.join(packageRoot, `dist/${directory}/tool.js`)
  );
  const definition = module.default;
  const issues = validateToolContract(definition);
  if (issues.length) throw new Error(`${directory}: ${JSON.stringify(issues)}`);
  const source = toolCatalogSource(definition);
  const contractFingerprint = createHash("sha256")
    .update(JSON.stringify(source))
    .digest("hex");
  entries.push(
    createToolCatalogEntry(
      definition,
      contractFingerprint,
      implementationDates.get(directory) ?? unknownImplementationDate,
    ),
  );
  contracts.push(portableToolContract(definition));
}
entries.sort((left, right) => left.id.localeCompare(right.id));
contracts.sort((left, right) => left.id.localeCompare(right.id));
const catalog = `${JSON.stringify({ entries, schemaVersion: 1 })}\n`;
const contractCollection = `${JSON.stringify({ contracts, schemaVersion: 1 })}\n`;
if (process.argv.includes("--check")) {
  const current = await readFile(committed, "utf8").catch(() => "");
  if (current !== catalog) {
    process.stderr.write("packages/tools/catalog.generated.json is stale.\n");
    process.exitCode = 1;
  }
  const currentContracts = await readFile(
    path.join(packageRoot, "contracts.generated.json"),
    "utf8",
  ).catch(() => "");
  if (currentContracts !== contractCollection) {
    process.stderr.write("packages/tools/contracts.generated.json is stale.\n");
    process.exitCode = 1;
  }
} else {
  await writeFile(committed, catalog);
  await writeFile(
    path.join(packageRoot, "contracts.generated.json"),
    contractCollection,
  );
}
await mkdir(path.join(packageRoot, "dist"), { recursive: true });
await writeFile(path.join(packageRoot, "dist/catalog.json"), catalog);
