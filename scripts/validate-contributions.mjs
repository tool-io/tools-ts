import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const sourcePrefix = "packages/tools/src/";
const baseIndex = process.argv.indexOf("--base");
const base =
  baseIndex >= 0
    ? process.argv[baseIndex + 1]
    : process.env.GITHUB_BASE_REF
      ? `origin/${process.env.GITHUB_BASE_REF}`
      : undefined;

const gitLines = (argumentsList) =>
  execFileSync("git", argumentsList, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  })
    .trim()
    .split("\n")
    .filter(Boolean);

const added = new Set(
  base
    ? gitLines(["diff", "--name-only", "--diff-filter=A", `${base}...HEAD`])
    : [],
);
for (const file of gitLines(["ls-files", "--others", "--exclude-standard"]))
  added.add(file);

const newToolFiles = [...added].filter(
  (file) => file.startsWith(sourcePrefix) && file.endsWith("/tool.ts"),
);
const failures = [];

for (const relativeToolFile of newToolFiles) {
  const directory = path.dirname(relativeToolFile);
  const toolSource = await readFile(path.join(root, relativeToolFile), "utf8");
  if (!/export\s+default\s+/.test(toolSource)) continue;

  const indexFile = path.join(root, directory, "index.ts");
  const specFile = path.join(root, directory, "tool.spec.ts");
  let indexSource = "";
  try {
    indexSource = await readFile(indexFile, "utf8");
  } catch {
    failures.push(`${directory}: new public tools require index.ts.`);
  }
  if (!/\bas\s+example\b|\bexample\s*[,}]/.test(indexSource))
    failures.push(
      `${directory}: index.ts must export one canonical value as example.`,
    );
  try {
    await access(specFile);
  } catch {
    failures.push(`${directory}: new public tools require tool.spec.ts.`);
  }
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Validated contribution structure for ${newToolFiles.length} new public tool files.\n`,
  );
}

