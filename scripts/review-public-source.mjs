import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  mkdir,
  readFile,
  writeFile,
  lstat,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const command = promisify(execFile);
const git = async (...args) =>
  (
    await command("git", args, {
      cwd: root,
      maxBuffer: 64 * 1024 * 1024,
    })
  ).stdout;
const files = [
  ...new Set(
    (
      await git(
        "ls-files",
        "--cached",
        "--others",
        "--exclude-standard",
        "-z",
      )
    )
      .split("\0")
      .filter(Boolean),
  ),
].sort();
const findings = [],
  extensions = {},
  topLevel = {},
  attributionFiles = [];
const allowedRoots = new Set([
  ".github",
  ".gitignore",
  ".prettierrc",
  ".prettierignore",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "LICENSE",
  "README.md",
  "contracts",
  "docs",
  "fixtures",
  "packages",
  "scripts",
  "tests",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
]);
const treeHash = (await import("node:crypto")).createHash(
  "sha256",
);
for (const file of files) {
  const stat = await lstat(path.join(root, file)).catch(
    (error) =>
      error.code === "ENOENT"
        ? undefined
        : Promise.reject(error),
  );
  if (!stat) continue; // A tracked deletion is absent from the proposed tree.
  const top = file.split("/")[0];
  topLevel[top] = (topLevel[top] ?? 0) + 1;
  const extension = path.extname(file) || "(none)";
  extensions[extension] = (extensions[extension] ?? 0) + 1;
  if (!allowedRoots.has(top))
    findings.push({
      file,
      reason: "Unreviewed top-level scope",
    });
  if (
    /(?:^|\/)(?:DEVELOPER\.md|AGENTS\.md|\.log|\.env(?:\..*)?|node_modules|coverage|credentials)(?:\/|$)|\.(?:tgz|zip|db|sqlite|p12|pfx)$/i.test(
      file,
    )
  )
    findings.push({
      file,
      reason: "Private or operational artifact path",
    });
  if (stat.isSymbolicLink()) {
    findings.push({
      file,
      reason: "Public source symlink requires review",
    });
    continue;
  }
  const bytes = await readFile(path.join(root, file));
  treeHash
    .update(file)
    .update("\0")
    .update(String(stat.mode & 0o777))
    .update("\0")
    .update(String(bytes.length))
    .update("\0")
    .update(bytes);
  if (
    /\.(?:md|ts|mjs)$/i.test(file) &&
    /(?:SPDX-License-Identifier|Copyright\s+(?:\(c\)\s+)?\d|licensed under|adapted from|derived from)/i.test(
      bytes.toString("utf8"),
    )
  )
    attributionFiles.push(file);
  if (
    !/\.(?:ts|json|md|mjs|yaml|yml|txt)$/i.test(file) &&
    ![
      ".gitignore",
      ".prettierrc",
      ".prettierignore",
      "LICENSE",
    ].includes(path.basename(file))
  )
    findings.push({
      file,
      reason: "Non-code asset needs redistribution review",
    });
}
assert.match(
  await readFile(path.join(root, "LICENSE"), "utf8"),
  /MIT License/,
);
const manifest = JSON.parse(
  await readFile(
    path.join(root, "packages/tools/package.json"),
    "utf8",
  ),
);
const dependencies = [];
for (const [name, expectedVersion] of Object.entries(
  manifest.dependencies ?? {},
)) {
  const directory = path.join(
    root,
    "packages/tools/node_modules",
    name,
  );
  const installed = JSON.parse(
    await readFile(
      path.join(directory, "package.json"),
      "utf8",
    ),
  );
  assert.equal(
    installed.version,
    expectedVersion,
    `${name}: lock/install mismatch`,
  );
  assert.equal(
    installed.license,
    "MIT",
    `${name}: license change needs review`,
  );
  assert.equal(
    Object.keys(installed.dependencies ?? {}).length,
    0,
    `${name}: review new runtime dependencies`,
  );
  assert.ok(
    !["preinstall", "install", "postinstall"].some(
      (hook) => installed.scripts?.[hook],
    ),
    `${name}: install hook needs review`,
  );
  const license = await readFile(
    path.join(directory, "LICENSE"),
    "utf8",
  ).catch(() =>
    readFile(path.join(directory, "LICENSE.txt"), "utf8"),
  );
  assert.match(license, /Permission is hereby granted/);
  dependencies.push({
    name,
    version: installed.version,
    license: installed.license,
    transitiveRuntimeDependencies: 0,
    installHooks: [],
  });
}
const report = {
  schemaVersion: 1,
  revision: (await git("rev-parse", "HEAD")).trim(),
  candidateContentFingerprint: treeHash.digest("hex"),
  files: files.length,
  topLevel,
  extensions,
  attributionFiles,
  dependencies,
  findings,
  limitations:
    "Candidate content inventory, not a Git release revision or proof of original authorship. Attribution-bearing source and fixtures require human review; dependency MIT notices stay in their separately installed packages. External datasets are excluded and retain their own licensing. Reachable-history secret scanning is a separate gate.",
};
await mkdir(path.join(root, ".log"), { recursive: true });
await writeFile(
  path.join(root, ".log/public-source-review.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    files: files.length,
    dependencies,
    findings,
    candidateContentFingerprint:
      report.candidateContentFingerprint,
  }),
);
if (findings.length) process.exitCode = 1;
