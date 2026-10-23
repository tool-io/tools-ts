import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { releaseVersionIssues } from "./release-version.mjs";
import { packageBudgetIssues } from "./package-budgets.mjs";
import {
  buildFingerprint,
  capture,
  distRoot,
  expectedDistFiles,
  fileSetIssues,
  listFiles,
  packageRoot,
  readBuildConfiguration,
  receiptFile,
  root,
  runCompiler,
} from "./package-build.mjs";

const manifest = JSON.parse(
  await readFile(path.join(packageRoot, "package.json"), "utf8"),
);
const publicTools = JSON.parse(
  await readFile(path.join(packageRoot, "public-tools.generated.json"), "utf8"),
).tools;
const failures = [];
const workspaceManifest = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8"),
);

if (
  manifest.engines?.node !== ">=24.0.0" ||
  workspaceManifest.engines?.node !== ">=24.0.0"
)
  failures.push("The package and workspace must require Node.js >=24.0.0.");

if (manifest.name !== "@tool.io/tools")
  failures.push("Package name must remain @tool.io/tools.");
if (manifest.private !== false)
  failures.push("The tools package must be eligible for an eventual release.");
if (manifest.license !== "MIT") failures.push("Package license must be MIT.");
if (manifest.sideEffects !== false)
  failures.push("Package must declare sideEffects: false for tree-shaking.");
failures.push(...releaseVersionIssues(manifest));

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

const assertNoFailures = () => {
  if (failures.length) throw new Error(failures.join("\n"));
};

await capture(process.execPath, [
  path.join(root, "scripts/generate-structure.mjs"),
  "--check",
]);
const configuration = await readBuildConfiguration();
const expected = expectedDistFiles(configuration);
failures.push(...fileSetIssues(expected, new Set(await listFiles(distRoot))));
const fingerprint = await buildFingerprint(configuration);
const receipt = await readFile(receiptFile, "utf8")
  .then(JSON.parse)
  .catch(() => undefined);
if (receipt?.schemaVersion !== 1 || receipt.fingerprint !== fingerprint)
  failures.push(
    "The package build is missing or stale. Run pnpm build before checking the release.",
  );
assertNoFailures();
await capture(process.execPath, [
  path.join(root, "scripts/generate-catalog.mjs"),
  "--check",
]);

const packDirectory = await mkdtemp(path.join(tmpdir(), "tool-io-pack-"));
try {
  await capture(
    "npm",
    [
      "pack",
      "--ignore-scripts",
      "--offline",
      "--update-notifier=false",
      "--loglevel=error",
      "--pack-destination",
      packDirectory,
      "--cache",
      path.join(tmpdir(), "tool-io-npm-cache"),
    ],
    { cwd: packageRoot },
  );
  const archives = (await readdir(packDirectory)).filter((name) =>
    name.endsWith(".tgz"),
  );
  if (archives.length !== 1)
    throw new Error(
      `npm pack created ${archives.length} archives instead of exactly one.`,
    );
  const archive = path.join(packDirectory, archives[0]);
  const compressedSize = (await stat(archive)).size;
  const listing = await capture("tar", ["-tzf", archive]);
  const packedFiles = new Set(
    listing
      .split("\n")
      .filter(Boolean)
      .map((file) => file.replace(/^package\//, "")),
  );
  const expectedPackage = new Set([
    "package.json",
    ...manifest.files.filter((file) => file !== "dist"),
    ...[...expected].map((file) => `dist/${file}`),
  ]);
  failures.push(...fileSetIssues(expectedPackage, packedFiles));
  for (const id of publicTools)
    for (const extension of ["js", "d.ts"])
      if (!packedFiles.has(`dist/${id}/index.${extension}`))
        failures.push(`${id} is missing its packed ${extension} entry point.`);
  assertNoFailures();

  // Exercise the archive's exports and declarations outside the repository.
  // Installed runtime dependencies are linked locally; this check never fetches or installs packages.
  await capture("tar", ["-xzf", archive, "-C", packDirectory]);
  const scope = path.join(packDirectory, "node_modules/@tool.io");
  await mkdir(scope, { recursive: true });
  const unpacked = path.join(packDirectory, "package");
  let unpackedSize = 0;
  const packedPaths = [...packedFiles];
  for (let index = 0; index < packedPaths.length; index += 64) {
    const sizes = await Promise.all(
      packedPaths.slice(index, index + 64).map(async (file) => {
        const info = await stat(path.join(unpacked, file));
        if (!info.isFile())
          throw new Error(`Packed artifact is not a file: ${file}`);
        return info.size;
      }),
    );
    unpackedSize += sizes.reduce((sum, size) => sum + size, 0);
  }
  await symlink(unpacked, path.join(scope, "tools"), "junction");
  await symlink(
    await realpath(path.join(packageRoot, "node_modules")),
    path.join(unpacked, "node_modules"),
    "junction",
  );
  const consumer = path.join(packDirectory, "consumer.mts");
  failures.push(
    ...packageBudgetIssues({
      compressedBytes: compressedSize,
      unpackedBytes: unpackedSize,
      files: packedFiles.size,
    }),
  );
  assertNoFailures();
  await writeFile(
    consumer,
    `
import { invalidInput } from "@tool.io/tools";
import { calculateBodyMassIndex, type BodyMassIndexOutput } from "@tool.io/tools/body-mass-index";
import { getToolMetadata, toolCatalogSize } from "@tool.io/tools/discovery";
import { loadToolModule, publicToolCount } from "@tool.io/tools/registry";
const result = calculateBodyMassIndex({ heightM: 2, weightKg: 80 });
if (!result.ok) throw new Error("Packed BMI execution failed.");
const output: BodyMassIndexOutput = result.output;
if (output.bmi !== 20) throw new Error("Packed BMI result differs.");
if (invalidInput([]).ok) throw new Error("Root export differs.");
if (toolCatalogSize !== publicToolCount || !getToolMetadata("statistics/median"))
  throw new Error("Packed discovery differs from its registry.");
const median = await loadToolModule("statistics/median");
if (!median?.example || !median.default.execute(median.example.input).ok)
  throw new Error("Packed dynamic tool loading failed.");
`,
  );
  await runCompiler(
    [
      consumer,
      "--outDir",
      path.join(packDirectory, "run"),
      "--target",
      "ES2022",
      "--lib",
      "ES2022",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      "--strict",
    ],
    { cwd: packDirectory },
  );
  const runtimes = new Set([process.execPath]);
  for (let index = 2; index < process.argv.length; index++) {
    if (process.argv[index] !== "--runtime" || !process.argv[index + 1])
      throw new Error(
        "Usage: validate-release-package.mjs [--runtime /path/to/node]",
      );
    runtimes.add(path.resolve(process.argv[++index]));
  }
  for (const runtime of runtimes) {
    const version = (await capture(runtime, ["--version"])).trim();
    if (!(Number(version.slice(1).split(".")[0]) >= 24))
      throw new Error(`Node.js 24 or newer is required; received ${version}.`);
    await capture(runtime, [path.join(packDirectory, "run/consumer.mjs")], {
      cwd: packDirectory,
    });
    process.stdout.write(`Packed consumer passed on ${version}.\n`);
  }
  if (fingerprint !== (await buildFingerprint(configuration)))
    throw new Error(
      "Build inputs changed while checking the release. Rebuild and retry.",
    );
  process.stdout.write(
    `Package footprint: ${compressedSize} compressed bytes, ${unpackedSize} unpacked bytes, ${packedFiles.size} files.\n`,
  );
  process.stdout.write(
    `Validated ${publicTools.length} packed tool subpaths across ${packedFiles.size} files, exact build contents, fresh sources, and isolated TypeScript/runtime imports; no package was retained or published.\n`,
  );
} finally {
  await rm(packDirectory, { force: true, recursive: true });
}
