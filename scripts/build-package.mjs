import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { runCompilerBatches } from "./compiler-batches.mjs";
import {
  buildFingerprint,
  capture,
  distRoot,
  expectedDistFiles,
  fileSetIssues,
  listFiles,
  readBuildConfiguration,
  receiptFile,
  root,
} from "./package-build.mjs";

const check = process.argv.includes("--check");
await capture(process.execPath, [
  path.join(root, "scripts/generate-structure.mjs"),
  ...(check ? ["--check"] : []),
]);
const configuration = await readBuildConfiguration();
const fingerprint = await buildFingerprint(configuration);
// Only this fixed, ignored compiler output directory is removed.
await rm(distRoot, { recursive: true, force: true });
await runCompilerBatches({ configuration, project: "tsconfig.build.json" });
// Resolution-only bucket shapes are not runtime modules and must not be shipped.
for (const file of await listFiles(distRoot)) {
  if (
    /^generated\/registry-buckets\/\d+\.generated\.typecheck\.(?:js|d\.ts)(?:\.map)?$/.test(
      file,
    )
  )
    await rm(path.join(distRoot, file));
}
await capture(process.execPath, [
  path.join(root, "scripts/generate-catalog.mjs"),
  ...(check ? ["--check"] : []),
]);
const issues = fileSetIssues(
  expectedDistFiles(configuration),
  new Set(await listFiles(distRoot)),
);
if (issues.length) throw new Error(issues.join("\n"));
if (fingerprint !== (await buildFingerprint(configuration)))
  throw new Error(
    "Build inputs changed during compilation. Run the build again.",
  );
await mkdir(path.dirname(receiptFile), { recursive: true });
await writeFile(
  receiptFile,
  `${JSON.stringify({ schemaVersion: 1, fingerprint })}\n`,
);
process.stdout.write(
  `Built ${expectedDistFiles(configuration).size} verified production artifacts.\n`,
);
