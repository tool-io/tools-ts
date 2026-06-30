import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const packageRoot = path.join(root, "packages/tools");
const sourceRoot = path.join(packageRoot, "src");
const manifest = JSON.parse(await readFile(path.join(packageRoot, "public-tools.generated.json"), "utf8"));
const { toolRegistry } = await import(path.join(packageRoot, "dist/registry.js"));
const { validateToolContract } = await import(path.join(packageRoot, "dist/core/contract.js"));

if (toolRegistry.size !== manifest.tools.length)
  throw new Error(`Registry has ${toolRegistry.size} entries for ${manifest.tools.length} public tools.`);

for (const directory of manifest.tools) {
  const module = await import(path.join(packageRoot, `dist/${directory}/index.js`));
  const definition = module.default;
  if (!definition) throw new Error(`${directory} does not have a default package export.`);
  if (definition.id !== directory)
    throw new Error(`${directory} exports tool ID ${String(definition.id)}.`);
  const issues = validateToolContract(definition);
  if (issues.length) throw new Error(`${directory}: ${JSON.stringify(issues)}`);
  if (toolRegistry.get(definition.id) !== definition)
    throw new Error(`${directory} is missing from the generated runtime registry.`);
}

const walk = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".spec.ts")) files.push(target);
  }
  return files;
};
const sourceFiles = await walk(sourceRoot);
const sourceSet = new Set(sourceFiles);
const dependencies = new Map();
for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  const imports = [];
  for (const match of source.matchAll(/(?:from\s+|import\s*)["'](\.[^"']+)["']/g)) {
    const base = path.resolve(path.dirname(file), match[1].replace(/\.js$/, ""));
    const candidates = [`${base}.ts`, path.join(base, "index.ts")];
    const target = candidates.find((candidate) => sourceSet.has(candidate));
    if (target) imports.push(target);
  }
  dependencies.set(file, imports);
}
const active = new Set();
const visited = new Set();
const visit = (file, trail) => {
  if (active.has(file))
    throw new Error(`Circular source dependency: ${[...trail, file].map((entry) => path.relative(sourceRoot, entry)).join(" -> ")}`);
  if (visited.has(file)) return;
  active.add(file);
  for (const dependency of dependencies.get(file) ?? []) visit(dependency, [...trail, file]);
  active.delete(file);
  visited.add(file);
};
for (const file of sourceFiles) visit(file, []);

process.stdout.write(`Validated ${manifest.tools.length} public tool contracts.\n`);
