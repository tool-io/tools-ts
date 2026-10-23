import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { auditHistory, scanText } from "./audit-history.mjs";

test("identifies known secret patterns without returning the matched text", () => {
  const fixtures = [
    ["private-key", ["-----BEGIN ", "OPENSSH PRIVATE KEY-----"].join("")],
    ["github-token", "ghp_" + "a".repeat(36)],
    ["npm-token", "npm_" + "b".repeat(36)],
    ["aws-access-key", "AKIA" + "A".repeat(16)],
    [
      "credential-url",
      ["postgres://", "user:password", "@localhost/database"].join(""),
    ],
  ];
  for (const [rule, value] of fixtures)
    assert.deepEqual(scanText(value), [rule]);
  assert.deepEqual(
    scanText("Use a private reporting channel and never commit tokens."),
    [],
  );
});

test("scans deleted historical blobs, commit messages and annotated tags", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "tool-io-history-test-"));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: directory,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  try {
    git("init", "--quiet");
    git("config", "user.name", "Audit fixture");
    git("config", "user.email", "audit@example.invalid");
    const blobToken = "ghp_" + "a".repeat(36);
    const commitToken = "npm_" + "b".repeat(36);
    const tagToken = "AKIA" + "C".repeat(16);
    await writeFile(path.join(directory, "fixture.txt"), blobToken);
    git("add", "fixture.txt");
    git("-c", "commit.gpgsign=false", "commit", "--quiet", "-m", commitToken);
    git(
      "-c",
      "tag.gpgsign=false",
      "tag",
      "--annotate",
      "audit-fixture",
      "-m",
      tagToken,
    );
    await rm(path.join(directory, "fixture.txt"));
    git("add", "--all");
    git(
      "-c",
      "commit.gpgsign=false",
      "commit",
      "--quiet",
      "-m",
      "Remove fixture",
    );
    const report = await auditHistory(directory);
    assert.equal(report.commits, 2);
    assert.equal(report.commitObjects, 2);
    assert.equal(report.tagObjects, 1);
    assert.deepEqual(report.workingTreeFindings, []);
    assert.deepEqual(
      new Set(report.findings.map((f) => `${f.objectType}:${f.rules[0]}`)),
      new Set(["blob:github-token", "commit:npm-token", "tag:aws-access-key"]),
    );
    for (const token of [blobToken, commitToken, tagToken])
      assert.ok(!JSON.stringify(report).includes(token));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
