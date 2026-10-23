import { link, mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { packageRoot, root, runCompiler } from "./package-build.mjs";

export const withRegistryBucketTypes = async ({
  sourceRoot,
  temporary,
  run,
}) => {
  const bucketRoot = path.join(sourceRoot, "generated/registry-buckets");
  const shared = path.join(temporary, "registry-bucket.typecheck.ts");
  const registry = path
    .join(sourceRoot, "generated/registry.generated.js")
    .split(path.sep)
    .join("/");
  await writeFile(
    shared,
    `// Temporary compiler interface; never runtime source.\nimport type { RegisteredToolModule } from ${JSON.stringify(registry)};\n\nexport declare const toolModuleLoaders: Readonly<\n  Record<string, () => Promise<RegisteredToolModule>>\n>;\n`,
  );
  const created = [];
  try {
    for (const entry of await readdir(bucketRoot, { withFileTypes: true })) {
      if (!entry.isFile() || !/^\d+\.generated\.ts$/.test(entry.name)) continue;
      const target = path.join(
        bucketRoot,
        entry.name.replace(/\.ts$/, ".typecheck.ts"),
      );
      // All resolution paths share one inode and one declaration body. Existing
      // files are never overwritten; compiler jobs must run sequentially.
      await link(shared, target);
      created.push(target);
    }
    return await run();
  } finally {
    for (const file of created) await rm(file);
    await rm(shared);
  }
};

export const createCompilerBatches = (files, sourceRoot, maxFiles = 1000) => {
  if (!Number.isSafeInteger(maxFiles) || maxFiles < 1)
    throw new Error("Compiler batch size must be a positive integer.");
  if (new Set(files).size !== files.length)
    throw new Error("Duplicate compiler roots are not allowed.");
  const groups = new Map();
  const buckets = [];
  for (const file of [...files].sort()) {
    const relative = path.relative(sourceRoot, file).split(path.sep).join("/");
    if (relative.startsWith("../") || path.isAbsolute(relative))
      throw new Error(`Compiler root outside source tree: ${file}`);
    if (/^generated\/registry-buckets\/\d+\.generated\.ts$/.test(relative)) {
      buckets.push(file);
      continue;
    }
    const group = relative.includes("/") ? relative.split("/")[0] : "root";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(file);
  }
  const batches = [];
  const append = (name, entries, size) => {
    for (let index = 0; index < entries.length; index += size)
      batches.push({
        name: `${name}-${Math.floor(index / size) + 1}`,
        files: entries.slice(index, index + size),
      });
  };
  let packed = [];
  let names = [];
  const flush = () => {
    if (!packed.length) return;
    batches.push({ name: `${names[0]}..${names.at(-1)}`, files: packed });
    packed = [];
    names = [];
  };
  for (const [name, entries] of groups) {
    for (let index = 0; index < entries.length; index += maxFiles) {
      const piece = entries.slice(index, index + maxFiles);
      if (packed.length + piece.length > maxFiles) flush();
      packed.push(...piece);
      names.push(name);
    }
  }
  flush();
  // A bucket imports around 1/256th of the tool collection. Keep the actual
  // implementations separate from the registry's declaration-only fan-in.
  append("registry-buckets", buckets, Math.min(4, maxFiles));
  return batches;
};

export const runCompilerBatches = async ({
  configuration,
  project,
  noEmit = false,
}) => {
  const files = configuration.files.map((file) =>
    path.resolve(packageRoot, file),
  );
  const batches = createCompilerBatches(files, path.join(packageRoot, "src"));
  if (!batches.length) throw new Error("No compiler roots were selected.");
  await mkdir(path.join(root, ".log"), { recursive: true });
  const temporary = await mkdtemp(path.join(root, ".log/compiler-batches-"));
  try {
    return await withRegistryBucketTypes({
      sourceRoot: path.join(packageRoot, "src"),
      temporary,
      run: async () => {
        for (let index = 0; index < batches.length; index++) {
          const batch = batches[index];
          const config = path.join(temporary, "batch.json");
          await writeFile(
            config,
            JSON.stringify({
              extends: path.resolve(packageRoot, project),
              compilerOptions: {
                moduleSuffixes: [".typecheck", ""],
                ...(noEmit &&
                batch.files.some((file) =>
                  /(?:\.(?:spec|test)|-(?:testing|test-support|spec-support|spec))\.ts$/.test(
                    file,
                  ),
                )
                  ? { types: ["node"] }
                  : {}),
                ...(noEmit ? { noEmit: true } : {}),
              },
              files: batch.files,
              include: [],
            }),
          );
          process.stdout.write(
            `Compiler batch ${index + 1}/${batches.length}: ${batch.name} (${batch.files.length} roots)\n`,
          );
          await runCompiler(["-p", config]);
        }
        return { roots: files.length, batches: batches.length };
      },
    });
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
};
