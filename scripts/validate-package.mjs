import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";

const root = path.resolve(import.meta.dirname, "..");
const packageRoot = path.join(root, "packages/tools");
const sourceRoot = path.join(packageRoot, "src");
const manifest = JSON.parse(
  await readFile(path.join(packageRoot, "public-tools.generated.json"), "utf8"),
);
const { toolRegistry } = await import(
  path.join(packageRoot, "dist/registry.js")
);
const { validateToolContract } = await import(
  path.join(packageRoot, "dist/core/contract.js")
);
const { portableToolContract } = await import(
  path.join(packageRoot, "dist/core/portable-contract.js")
);
const generatedContracts = JSON.parse(
  await readFile(path.join(packageRoot, "contracts.generated.json"), "utf8"),
);

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const assertJsonSerializable = (value, label) => {
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch (error) {
    throw new Error(`${label} is not JSON-serializable.`, { cause: error });
  }
  if (serialized === undefined)
    throw new Error(`${label} is not JSON-serializable.`);
  const restored = JSON.parse(serialized);
  if (!isDeepStrictEqual(restored, value))
    throw new Error(`${label} changes during a JSON round trip.`);
};

if (toolRegistry.size !== manifest.tools.length)
  throw new Error(
    `Registry has ${toolRegistry.size} entries for ${manifest.tools.length} public tools.`,
  );
if (
  generatedContracts.schemaVersion !== 1 ||
  !Array.isArray(generatedContracts.contracts) ||
  generatedContracts.contracts.length !== manifest.tools.length
)
  throw new Error("Generated portable contract collection is incomplete.");
const contractById = new Map(
  generatedContracts.contracts.map((contract) => [contract.id, contract]),
);

const toolsWithoutExamples = [];
let authoredExampleCount = 0;
for (const directory of manifest.tools) {
  const module = await import(
    path.join(packageRoot, `dist/${directory}/index.js`)
  );
  const definition = module.default;
  if (!definition)
    throw new Error(`${directory} does not have a default package export.`);
  if (definition.id !== directory)
    throw new Error(`${directory} exports tool ID ${String(definition.id)}.`);
  const issues = validateToolContract(definition);
  if (issues.length) throw new Error(`${directory}: ${JSON.stringify(issues)}`);
  if (toolRegistry.get(definition.id) !== definition)
    throw new Error(
      `${directory} is missing from the generated runtime registry.`,
    );
  const portableContract = portableToolContract(definition);
  assertJsonSerializable(portableContract, `${directory} portable contract`);
  if (!isDeepStrictEqual(contractById.get(directory), portableContract))
    throw new Error(
      `${directory} does not match its generated portable contract.`,
    );

  const example = module.example;
  if (example === undefined) {
    toolsWithoutExamples.push(directory);
    continue;
  }
  if (!isRecord(example) || !("input" in example))
    throw new Error(`${directory} exports an invalid authored example.`);
  assertJsonSerializable(example.input, `${directory} example input`);
  const result = await definition.execute(example.input);
  if (!result.ok)
    throw new Error(
      `${directory} example input does not execute successfully: ${JSON.stringify(result.error)}.`,
    );
  if (Object.prototype.hasOwnProperty.call(example, "output")) {
    assertJsonSerializable(example.output, `${directory} example output`);
    if (!isDeepStrictEqual(result.output, example.output))
      throw new Error(
        `${directory} example output does not match its execution result.`,
      );
  }
  authoredExampleCount += 1;
}

const walk = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".spec.ts"))
      files.push(target);
  }
  return files;
};
const sourceFiles = await walk(sourceRoot);
const sourceSet = new Set(sourceFiles);
const dependencies = new Map();
for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  const imports = [];
  for (const match of source.matchAll(
    /(?:from\s+|import\s*)["'](\.[^"']+)["']/g,
  )) {
    const base = path.resolve(
      path.dirname(file),
      match[1].replace(/\.js$/, ""),
    );
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
    throw new Error(
      `Circular source dependency: ${[...trail, file].map((entry) => path.relative(sourceRoot, entry)).join(" -> ")}`,
    );
  if (visited.has(file)) return;
  active.add(file);
  for (const dependency of dependencies.get(file) ?? [])
    visit(dependency, [...trail, file]);
  active.delete(file);
  visited.add(file);
};
for (const file of sourceFiles) visit(file, []);

process.stdout.write(
  `Validated ${manifest.tools.length} public tool contracts and ${authoredExampleCount} authored examples; ${toolsWithoutExamples.length} tools do not yet publish an example.\n`,
);
if (process.argv.includes("--examples-report") && toolsWithoutExamples.length)
  process.stdout.write(`${toolsWithoutExamples.join("\n")}\n`);
