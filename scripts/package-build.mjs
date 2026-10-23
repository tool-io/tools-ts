import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export const root = path.resolve(import.meta.dirname, "..");
export const packageRoot = path.join(root, "packages/tools");
export const distRoot = path.join(packageRoot, "dist");
export const receiptFile = path.join(
  packageRoot,
  "node_modules/.cache/tool.io/build-receipt.json",
);

export const capture = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout = [],
      stderr = [];
    let bytes = 0;
    const collect = (target) => (chunk) => {
      bytes += chunk.length;
      if (bytes > 64 * 1024 * 1024) {
        child.kill();
        reject(new Error(`${command} output exceeded 64 MiB.`));
      } else target.push(chunk);
    };
    child.stdout.on("data", collect(stdout));
    child.stderr.on("data", collect(stderr));
    child.once("error", reject);
    child.once("close", (code, signal) => {
      const diagnostics = Buffer.concat(stderr).toString("utf8").trim();
      if (code !== 0)
        reject(
          new Error(
            `${command} ${args.join(" ")} failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}${diagnostics ? `:\n${diagnostics}` : ""}${Buffer.concat(stdout).toString("utf8")}`,
          ),
        );
      else resolve(Buffer.concat(stdout).toString("utf8"));
    });
  });

export const runCompiler = async (args, options = {}) => {
  const compilerRoot = path.join(root, "node_modules/typescript");
  const manifest = JSON.parse(
    await readFile(path.join(compilerRoot, "package.json"), "utf8"),
  );
  return capture(
    process.execPath,
    [path.resolve(compilerRoot, manifest.bin.tsc), ...args],
    { cwd: packageRoot, ...options },
  );
};

export const readBuildConfiguration = async () => {
  const configuration = JSON.parse(
    await runCompiler(["--showConfig", "-p", "tsconfig.build.json"]),
  );
  if (
    path.resolve(packageRoot, configuration.compilerOptions.outDir) !== distRoot
  )
    throw new Error("The package build must use packages/tools/dist.");
  return configuration;
};

export const expectedDistFiles = (configuration) => {
  const sourceRoot = path.resolve(
    packageRoot,
    configuration.compilerOptions.rootDir,
  );
  const files = new Set();
  for (const file of configuration.files) {
    if (file.endsWith(".d.ts")) continue;
    const relative = path
      .relative(sourceRoot, path.resolve(packageRoot, file))
      .split(path.sep)
      .join("/");
    if (relative.startsWith("../") || !relative.endsWith(".ts"))
      throw new Error(`Unsupported production source path: ${file}`);
    const base = relative.slice(0, -3);
    if (
      /^generated\/registry-buckets\/\d+\.generated\.typecheck\.ts$/.test(
        relative,
      )
    )
      continue;
    files.add(`${base}.js`);
    if (configuration.compilerOptions.sourceMap) files.add(`${base}.js.map`);
    if (configuration.compilerOptions.declaration) files.add(`${base}.d.ts`);
    if (configuration.compilerOptions.declarationMap)
      files.add(`${base}.d.ts.map`);
  }
  return files;
};

export const buildFingerprint = async (configuration) => {
  const inputs = [
    ...configuration.files.map((file) => path.resolve(packageRoot, file)),
    ...[
      "package.json",
      "pnpm-lock.yaml",
      "packages/tools/package.json",
      "packages/tools/catalog-data.d.ts",
      "packages/tools/tsconfig.json",
      "packages/tools/tsconfig.build.json",
      "scripts/build-package.mjs",
      "scripts/package-build.mjs",
      "scripts/compiler-batches.mjs",
      "scripts/generate-structure.mjs",
      "scripts/generate-catalog.mjs",
      "scripts/implementation-dates.mjs",
      "scripts/contract-schema-validation.mjs",
    ].map((file) => path.join(root, file)),
    ...(await readdir(path.join(root, "contracts")))
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.join(root, "contracts", file)),
  ];
  const hash = createHash("sha256");
  for (const file of [...new Set(inputs)].sort()) {
    const content = await readFile(file);
    if (
      file.startsWith(path.join(packageRoot, "src") + path.sep) &&
      /\b(?:from\s*|import\s*)["'](?:vitest(?:\/|["'])|@vitest\/|node:test["'])/.test(
        content.toString("utf8"),
      )
    )
      throw new Error(
        `Test dependency in production source: ${path.relative(root, file)}`,
      );
    hash.update(
      JSON.stringify([
        path.relative(root, file).split(path.sep).join("/"),
        content.length,
      ]),
    );
    hash.update(content);
  }
  return hash.digest("hex");
};

export const listFiles = async (directory, prefix = "") => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory())
      files.push(
        ...(await listFiles(path.join(directory, entry.name), `${relative}/`)),
      );
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unexpected non-file build artifact: ${relative}`);
  }
  return files;
};

export const fileSetIssues = (expected, actual) => [
  ...[...expected]
    .filter((file) => !actual.has(file))
    .map((file) => `Missing build artifact: ${file}`),
  ...[...actual]
    .filter((file) => !expected.has(file))
    .map((file) => `Unexpected build artifact: ${file}`),
];
