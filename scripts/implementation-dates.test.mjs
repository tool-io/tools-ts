import assert from "node:assert/strict";
import test from "node:test";
import {
  parseAddedToolDates,
  resolveImplementationDates,
  unknownImplementationDate,
} from "./implementation-dates.mjs";

test("parses the earliest addition date for each tool path", () => {
  const dates =
    parseAddedToolDates(`@@toolio-author-date:2026-08-24T12:00:00+02:00

packages/tools/src/check/my-ip/tool.ts
@@toolio-author-date:2026-08-23T10:00:00+02:00

packages/tools/src/check/my-ip/tool.ts
packages/tools/src/validate/ip-address/tool.ts
`);
  assert.equal(dates.get("check/my-ip"), "2026-08-23T10:00:00+02:00");
  assert.equal(dates.get("validate/ip-address"), "2026-08-23T10:00:00+02:00");
});

test("reuses non-placeholder catalog dates without invoking Git", () => {
  const dates = resolveImplementationDates({
    directories: ["check/my-ip"],
    previousDates: new Map([["check/my-ip", "2026-08-24T11:50:00+02:00"]]),
    runGit: () => assert.fail("Git should not run for cached dates."),
  });
  assert.equal(dates.get("check/my-ip"), "2026-08-24T11:50:00+02:00");
});

test("resolves new tools with one bulk history query", () => {
  const calls = [];
  const dates = resolveImplementationDates({
    directories: ["new/tool", "working/tool"],
    previousDates: new Map(),
    runGit: (arguments_) => {
      calls.push(arguments_);
      if (arguments_[0] === "log")
        return `@@toolio-author-date:2026-08-24T12:17:00+02:00

packages/tools/src/new/tool/tool.ts
`;
      return "";
    },
  });
  assert.equal(dates.get("new/tool"), "2026-08-24T12:17:00+02:00");
  assert.equal(dates.get("working/tool"), unknownImplementationDate);
  assert.equal(calls.length, 2);
});

test("uses a follow query only for unresolved tracked paths", () => {
  const calls = [];
  const dates = resolveImplementationDates({
    directories: ["renamed/tool"],
    previousDates: new Map([["renamed/tool", unknownImplementationDate]]),
    runGit: (arguments_) => {
      calls.push(arguments_);
      if (arguments_[0] === "ls-files")
        return "packages/tools/src/renamed/tool/tool.ts\n";
      if (arguments_.includes("--follow"))
        return "2026-08-24T12:00:00+02:00\n2026-08-20T09:00:00+02:00\n";
      return "";
    },
  });
  assert.equal(dates.get("renamed/tool"), "2026-08-20T09:00:00+02:00");
  assert.equal(
    calls.filter((arguments_) => arguments_.includes("--follow")).length,
    1,
  );
});
