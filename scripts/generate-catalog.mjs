import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const packageRoot = path.join(root, "packages/tools");
const manifest = JSON.parse(await readFile(path.join(packageRoot, "public-tools.generated.json"), "utf8"));
const { createToolCatalogEntry, toolCatalogSource } = await import(path.join(packageRoot, "dist/core/catalog.js"));
const { validateToolContract } = await import(path.join(packageRoot, "dist/core/contract.js"));
const entries = [];
for (const directory of manifest.tools) {
  const module = await import(path.join(packageRoot, `dist/${directory}/tool.js`));
  const definition = module.default;
  const issues = validateToolContract(definition);
  if (issues.length) throw new Error(`${directory}: ${JSON.stringify(issues)}`);
  const source = toolCatalogSource(definition);
  const contractFingerprint = createHash("sha256")
    .update(JSON.stringify(source))
    .digest("hex");
  entries.push(createToolCatalogEntry(definition, contractFingerprint));
}
entries.sort((left, right) => left.id.localeCompare(right.id));
const catalog = `${JSON.stringify({ entries, schemaVersion: 1 })}\n`;
const committed = path.join(packageRoot, "catalog.generated.json");
if (process.argv.includes("--check")) {
  const current = await readFile(committed, "utf8").catch(() => "");
  if (current !== catalog) {
    process.stderr.write("packages/tools/catalog.generated.json is stale.\n");
    process.exitCode = 1;
  }
} else {
  await writeFile(committed, catalog);
}
await mkdir(path.join(packageRoot, "dist"), { recursive: true });
await writeFile(path.join(packageRoot, "dist/catalog.json"), catalog);
