import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { calculateLongestCommonSubsequence } from "../longest-common-subsequence/tool.js";

export type UnifiedDiffInput = {
  readonly before: string;
  readonly after: string;
  readonly contextLines?: number;
  readonly oldLabel?: string;
  readonly newLabel?: string;
};
export type UnifiedDiffOutput = {
  readonly addedLines: number;
  readonly changed: boolean;
  readonly diff: string;
  readonly hunkCount: number;
  readonly removedLines: number;
};
const labelSchema = {
  description:
    "ASCII path-like display label, not a filesystem operation; timestamps are omitted.",
  minLength: 1,
  maxLength: 128,
  pattern: "^[A-Za-z0-9_./-]+(?![\\s\\S])",
  type: "string",
} as const;
export const inputSchema = {
  additionalProperties: false,
  properties: {
    before: { maxLength: 16_384, type: "string" },
    after: { maxLength: 16_384, type: "string" },
    contextLines: { default: 3, minimum: 0, maximum: 20, type: "integer" },
    oldLabel: { ...labelSchema, default: "a/input.txt" },
    newLabel: { ...labelSchema, default: "b/input.txt" },
  },
  required: ["before", "after"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    addedLines: { minimum: 0, maximum: 256, type: "integer" },
    changed: { type: "boolean" },
    diff: { maxLength: 65_536, type: "string" },
    hunkCount: { minimum: 0, maximum: 512, type: "integer" },
    removedLines: { minimum: 0, maximum: 256, type: "integer" },
  },
  required: ["addedLines", "changed", "diff", "hunkCount", "removedLines"],
  type: "object",
} as const;
type Line = { readonly text: string; readonly newline: boolean };
type Operation = {
  readonly kind: "add" | "delete" | "equal";
  readonly line: Line;
};
const linesOf = (text: string): Line[] => {
  if (text === "") return [];
  const parts = text.split("\n"),
    terminated = text.endsWith("\n");
  if (terminated) parts.pop();
  return parts.map((part, i) => ({
    text: part,
    newline: i < parts.length - 1 || terminated,
  }));
};
const isInput = (input: unknown): input is UnifiedDiffInput =>
  matchesModelInput(input, inputSchema);
const range = (consumed: number, count: number): string => {
  const start = count === 0 ? consumed : consumed + 1;
  return count === 1 ? String(start) : start + "," + count;
};

/** Encode complete line identities as bounded private tokens, then reuse core LCS. */
export const calculateUnifiedDiff = (
  input: unknown,
): ToolResult<UnifiedDiffOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  const before = linesOf(input.before),
    after = linesOf(input.after);
  for (const [field, lines] of [
    ["before", before],
    ["after", after],
  ] as const)
    if (lines.length > 256)
      return invalidInput([
        {
          code: "resource_limit_exceeded",
          field,
          message: "Each input must contain at most 256 LF-delimited lines.",
        },
      ]);
  const dictionary = new Map<string, string>();
  const encode = (line: Line): string => {
    const key = JSON.stringify([line.text, line.newline]);
    let token = dictionary.get(key);
    if (token === undefined) {
      token = String.fromCodePoint(0xe000 + dictionary.size);
      dictionary.set(key, token);
    }
    return token;
  };
  const oldTokens = before.map(encode),
    newTokens = after.map(encode);
  const common = calculateLongestCommonSubsequence({
    first: oldTokens.join(""),
    second: newTokens.join(""),
  }).sequence;
  const operations: Operation[] = [];
  let oldIndex = 0,
    newIndex = 0;
  for (const token of common) {
    while (oldIndex < before.length && oldTokens[oldIndex] !== token)
      operations.push({ kind: "delete", line: before[oldIndex++] });
    while (newIndex < after.length && newTokens[newIndex] !== token)
      operations.push({ kind: "add", line: after[newIndex++] });
    if (oldIndex >= before.length || newIndex >= after.length)
      throw new Error("LCS returned a token outside its input subsequences.");
    operations.push({ kind: "equal", line: before[oldIndex++] });
    newIndex += 1;
  }
  while (oldIndex < before.length)
    operations.push({ kind: "delete", line: before[oldIndex++] });
  while (newIndex < after.length)
    operations.push({ kind: "add", line: after[newIndex++] });
  const addedLines = operations.filter((op) => op.kind === "add").length;
  const removedLines = operations.filter((op) => op.kind === "delete").length;
  if (addedLines + removedLines === 0)
    return toolSuccess({
      addedLines: 0,
      changed: false,
      diff: "",
      hunkCount: 0,
      removedLines: 0,
    });
  const context = input.contextLines ?? 3;
  const hunks: { start: number; end: number }[] = [];
  operations.forEach((op, i) => {
    if (op.kind === "equal") return;
    const start = Math.max(0, i - context),
      end = Math.min(operations.length, i + context + 1),
      previous = hunks.at(-1);
    if (previous && start <= previous.end)
      previous.end = Math.max(previous.end, end);
    else hunks.push({ start, end });
  });
  const oldOffsets = [0],
    newOffsets = [0];
  for (const op of operations) {
    oldOffsets.push(
      oldOffsets[oldOffsets.length - 1] + Number(op.kind !== "add"),
    );
    newOffsets.push(
      newOffsets[newOffsets.length - 1] + Number(op.kind !== "delete"),
    );
  }
  let diff =
    "--- " +
    (input.oldLabel ?? "a/input.txt") +
    "\n+++ " +
    (input.newLabel ?? "b/input.txt") +
    "\n";
  for (const hunk of hunks) {
    const oldCount = oldOffsets[hunk.end] - oldOffsets[hunk.start],
      newCount = newOffsets[hunk.end] - newOffsets[hunk.start];
    diff +=
      "@@ -" +
      range(oldOffsets[hunk.start], oldCount) +
      " +" +
      range(newOffsets[hunk.start], newCount) +
      " @@\n";
    for (const op of operations.slice(hunk.start, hunk.end)) {
      diff +=
        (op.kind === "equal" ? " " : op.kind === "add" ? "+" : "-") +
        op.line.text +
        "\n";
      if (!op.line.newline) diff += "\\ No newline at end of file\n";
    }
  }
  return toolSuccess({
    addedLines,
    changed: true,
    diff,
    hunkCount: hunks.length,
    removedLines,
  });
};
export const unifiedDiffExample = {
  input: {
    before: "alpha\nbeta\ngamma\n",
    after: "alpha\nBETA\ngamma\ndelta\n",
    contextLines: 1,
  },
  output: {
    addedLines: 2,
    changed: true,
    diff: "--- a/input.txt\n+++ b/input.txt\n@@ -1,3 +1,4 @@\n alpha\n-beta\n+BETA\n gamma\n+delta\n",
    hunkCount: 1,
    removedLines: 1,
  },
} satisfies ToolExample<UnifiedDiffInput, UnifiedDiffOutput>;
export const unifiedDiffTool = createModelDefinition<
  UnifiedDiffInput,
  UnifiedDiffOutput
>({
  id: "text/unified-diff",
  title: "Unified Diff Generator",
  description:
    "Generate bounded LF-oriented unified text hunks with exact insertion/deletion ranges, preserved CR content and missing-final-newline markers, reusing the existing LCS tie convention without filesystem access or GNU byte-for-byte equivalence.",
  inputSchema,
  outputSchema,
  execute: calculateUnifiedDiff,
});
export const runUnifiedDiff = unifiedDiffTool.execute;
export default unifiedDiffTool;
