import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateUnifiedDiff,
  unifiedDiffExample as example,
} from "./tool.js";

/** Independent tiny unified-patch reader for complete-LF test cases. */
const applyCompleteLinePatch = (before: string, diff: string): string => {
  if (diff === "") return before;
  const old = before === "" ? [] : before.slice(0, -1).split("\n"),
    result: string[] = [];
  const lines = diff.split("\n");
  lines.pop();
  let cursor = 0,
    i = 2;
  while (i < lines.length) {
    const header = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@$/.exec(
      lines[i++],
    );
    if (!header) throw new Error("Invalid hunk header");
    const oldCount = header[2] === undefined ? 1 : Number(header[2]);
    const start = Number(header[1]) - (oldCount === 0 ? 0 : 1);
    result.push(...old.slice(cursor, start));
    cursor = start;
    while (i < lines.length && !lines[i].startsWith("@@ ")) {
      const line = lines[i++],
        prefix = line[0],
        text = line.slice(1);
      if (prefix === " " || prefix === "-") {
        expect(old[cursor]).toBe(text);
        cursor += 1;
      }
      if (prefix === " " || prefix === "+") result.push(text);
      if (prefix !== " " && prefix !== "-" && prefix !== "+")
        throw new Error("Invalid complete-line patch");
    }
  }
  result.push(...old.slice(cursor));
  return result.length ? result.join("\n") + "\n" : "";
};

describe("unified diff", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("uses empty-range conventions for file creation and deletion", () => {
    expect(tool.execute({ before: "", after: "x\n" })).toMatchObject({
      ok: true,
      output: {
        diff: "--- a/input.txt\n+++ b/input.txt\n@@ -0,0 +1 @@\n+x\n",
        addedLines: 1,
        removedLines: 0,
      },
    });
    expect(tool.execute({ before: "x\n", after: "" })).toMatchObject({
      ok: true,
      output: {
        diff: "--- a/input.txt\n+++ b/input.txt\n@@ -1 +0,0 @@\n-x\n",
        addedLines: 0,
        removedLines: 1,
      },
    });
    expect(tool.execute({ before: "same", after: "same" })).toEqual({
      ok: true,
      output: {
        addedLines: 0,
        changed: false,
        diff: "",
        hunkCount: 0,
        removedLines: 0,
      },
    });
  });
  it("preserves the missing-final-LF distinction and CR content", () => {
    expect(tool.execute({ before: "a", after: "a\n" })).toMatchObject({
      ok: true,
      output: {
        diff: "--- a/input.txt\n+++ b/input.txt\n@@ -1 +1 @@\n-a\n\\ No newline at end of file\n+a\n",
      },
    });
    expect(tool.execute({ before: "a\r\n", after: "b\r\n" })).toMatchObject({
      ok: true,
      output: {
        diff: "--- a/input.txt\n+++ b/input.txt\n@@ -1 +1 @@\n-a\r\n+b\r\n",
      },
    });
  });
  it("keeps separated zero-context hunks and respects explicit labels", () => {
    expect(
      tool.execute({
        ...example.input,
        contextLines: 0,
        oldLabel: "old.txt",
        newLabel: "new.txt",
      }),
    ).toMatchObject({
      ok: true,
      output: {
        hunkCount: 2,
        diff: "--- old.txt\n+++ new.txt\n@@ -2 +2 @@\n-beta\n+BETA\n@@ -3,0 +4 @@\n+delta\n",
      },
    });
  });
  it("round-trips all tiny binary-line texts and checks minimal edit counts by exhaustive subsequences", () => {
    const texts: string[][] = [[]];
    for (let length = 1; length <= 3; length += 1)
      for (let mask = 0; mask < 2 ** length; mask += 1)
        texts.push(
          Array.from({ length }, (_, i) =>
            Math.floor(mask / 2 ** i) % 2 ? "A" : "B",
          ),
        );
    for (const old of texts)
      for (const next of texts) {
        const before = old.length ? old.join("\n") + "\n" : "",
          after = next.length ? next.join("\n") + "\n" : "";
        const result = calculateUnifiedDiff({ before, after, contextLines: 1 });
        if (!result.ok) throw new Error("Expected success");
        expect(applyCompleteLinePatch(before, result.output.diff)).toBe(after);
        let longest = 0;
        for (let mask = 0; mask < 2 ** old.length; mask += 1) {
          const candidate = old.filter(
            (_, i) => Math.floor(mask / 2 ** i) % 2 === 1,
          );
          let matched = 0;
          for (const value of next)
            if (matched < candidate.length && value === candidate[matched])
              matched += 1;
          if (matched === candidate.length)
            longest = Math.max(longest, matched);
        }
        expect(result.output.addedLines + result.output.removedLines).toBe(
          old.length + next.length - 2 * longest,
        );
      }
  });
  it("does not mutate input and rejects malformed, injected-label, and excessive requests", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
    expect(
      tool.execute({ before: "x\n".repeat(257), after: "" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "resource_limit_exceeded", field: "before" }] },
    });
    expect(tool.execute({ ...example.input, contextLines: 21 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "contextLines" }] },
    });
    for (const oldLabel of ["bad\n", "bad\tname", "bad name"])
      expect(tool.execute({ ...example.input, oldLabel })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "oldLabel" }] },
      });
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    expect(tool.execute({})).toMatchObject({
      ok: false,
      error: {
        issues: tool.inputSchema.required?.map((field) => ({
          code: "required_field",
          field,
        })),
      },
    });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
  });
});
