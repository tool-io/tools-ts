import { spawn } from "node:child_process";
import { Readable } from "node:stream";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { capture, root } from "./package-build.mjs";

// Findings intentionally never include matched text: a report must not leak a secret.
export const secretRules = [
  [
    "private-key",
    /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/,
  ],
  [
    "github-token",
    /\b(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{60,255})\b/,
  ],
  ["npm-token", /\bnpm_[A-Za-z0-9]{36,255}\b/],
  ["aws-access-key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["slack-token", /\bxox[baprs]-[A-Za-z0-9-]{20,255}\b/],
  ["google-api-key", /\bAIza[A-Za-z0-9_-]{35}\b/],
  [
    "credential-url",
    /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s'"<>/@:]{1,100}:[^\s'"<>/@]{1,200}@[^\s'"<>/]{1,200}/i,
  ],
];
export const scanText = (text) =>
  secretRules.filter(([, pattern]) => pattern.test(text)).map(([id]) => id);
const suspectPath = (name) =>
  /(?:^|\/)(?:\.env(?:\.[^/]+)?|id_(?:rsa|ed25519)|credentials|\.log)(?:\/|$)|\.(?:p12|pfx|key|pem|zip|tar|tgz|bz2|sqlite|db)$/i.test(
    name,
  ) && !/(?:^|\/)\.env\.example$/.test(name);

export const auditHistory = async (directory = root) => {
  const git = (args) => capture("git", args, { cwd: directory });
  const refs = (await git(["for-each-ref", "--format=%(refname)"]))
    .trim()
    .split("\n")
    .filter(Boolean);
  const rows = (await git(["rev-list", "--objects", "--all"]))
    .trim()
    .split("\n")
    .filter(Boolean);
  const objects = rows.map((row) => {
    const split = row.indexOf(" ");
    return {
      oid: split < 0 ? row : row.slice(0, split),
      path: split < 0 ? "" : row.slice(split + 1),
    };
  });
  const byId = new Map(objects.map((o) => [o.oid, o]));
  const findings = [],
    largest = [];
  let blobs = 0,
    commitObjects = 0,
    tagObjects = 0,
    bytes = 0,
    remaining = 0,
    active,
    tail = "",
    header = Buffer.alloc(0);
  const matched = new Set();
  const child = spawn("git", ["cat-file", "--batch"], {
    cwd: directory,
    stdio: ["pipe", "pipe", "pipe"],
  });
  let diagnostic = "";
  child.stderr.on("data", (part) => {
    diagnostic += part.toString();
  });
  const completion = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`git cat-file failed (${code}): ${diagnostic}`)),
    );
  });
  // Consume stdout concurrently with stdin: a large repository must not deadlock.
  Readable.from(objects.map((o) => `${o.oid}\n`)).pipe(child.stdin);
  let separator = false;
  for await (const chunk of child.stdout) {
    let offset = 0;
    while (offset < chunk.length) {
      if (separator) {
        if (chunk[offset++] !== 10)
          throw new Error("Invalid Git object separator.");
        separator = false;
        continue;
      }
      if (!active) {
        const newline = chunk.indexOf(10, offset);
        if (newline < 0) {
          header = Buffer.concat([header, chunk.subarray(offset)]);
          break;
        }
        const line = Buffer.concat([
          header,
          chunk.subarray(offset, newline),
        ]).toString("utf8");
        header = Buffer.alloc(0);
        const match = /^([0-9a-f]+) (blob|tree|commit|tag) (\d+)$/.exec(line);
        if (!match) throw new Error("Invalid Git object header.");
        active = {
          ...byId.get(match[1]),
          type: match[2],
          bytes: Number(match[3]),
        };
        remaining = active.bytes;
        tail = "";
        matched.clear();
        offset = newline + 1;
        if (active.type === "blob") {
          blobs++;
          largest.push(active);
          largest.sort((a, b) => b.bytes - a.bytes);
          largest.length = Math.min(largest.length, 10);
        }
        if (active.type === "commit") commitObjects++;
        if (active.type === "tag") tagObjects++;
        if (active.type !== "tree") bytes += active.bytes;
      }
      const end = Math.min(chunk.length, offset + remaining);
      if (active.type !== "tree") {
        const text = tail + chunk.subarray(offset, end).toString("latin1");
        for (const rule of scanText(text)) matched.add(rule);
        tail = text.slice(-4096);
      }
      remaining -= end - offset;
      offset = end;
      if (remaining === 0) {
        if (matched.size)
          findings.push({
            oid: active.oid,
            objectType: active.type,
            path: active.path,
            rules: [...matched],
          });
        active = undefined;
        separator = true;
      }
    }
  }
  await completion;
  if (active || header.length || separator)
    throw new Error("Incomplete Git object stream.");
  const files = (
    await git(["ls-files", "--cached", "--others", "--exclude-standard", "-z"])
  )
    .split("\0")
    .filter(Boolean);
  const workingTreeFindings = [];
  for (const file of files) {
    const content = await readFile(path.join(directory, file)).catch((error) =>
      error.code === "ENOENT" ? undefined : Promise.reject(error),
    );
    if (!content) continue;
    const rules = scanText(content.toString("latin1"));
    if (rules.length) workingTreeFindings.push({ path: file, rules });
  }
  return {
    schemaVersion: 1,
    revision: (await git(["rev-parse", "HEAD"])).trim(),
    refs,
    commits: Number((await git(["rev-list", "--all", "--count"])).trim()),
    authors: [
      ...new Set(
        (await git(["log", "--all", "--format=%an <%ae>"])).trim().split("\n"),
      ),
    ],
    objects: objects.length,
    blobs,
    commitObjects,
    tagObjects,
    bytesScanned: bytes,
    largestBlobs: largest,
    suspiciousPaths: objects.filter((o) => suspectPath(o.path)),
    findings,
    workingTreeFindings,
    limitations:
      "Known-pattern scan, not proof of absence of secrets or a licensing opinion. Review flagged fixtures and source attribution separately. Unreachable local objects are not pushed by a normal Git push.",
  };
};

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = await auditHistory();
  const at = process.argv.indexOf("--output");
  if (at >= 0) {
    if (!process.argv[at + 1]) throw new Error("--output requires a filename.");
    const target = path.resolve(process.argv[at + 1]);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `${JSON.stringify(result, null, 2)}\n`);
  }
  console.log(
    JSON.stringify({
      revision: result.revision,
      commits: result.commits,
      blobs: result.blobs,
      bytesScanned: result.bytesScanned,
      findings: result.findings.length,
      workingTreeFindings: result.workingTreeFindings.length,
    }),
  );
  if (result.findings.length || result.workingTreeFindings.length)
    process.exitCode = 1;
}
