import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly entries: readonly string[];
  readonly order: string;
}>;
export type Output = Readonly<{
  readonly sortedEntries: readonly string[];
  readonly entryCount: number;
}>;

export const calculate = (input: Input): Output => {
  const parsed = input.entries.map((entry, index) => {
    const split = entry.indexOf("|");
    if (split < 1)
      simpleError(
        "entries",
        `Entry ${index + 1} must use ISO timestamp|text format.`,
        "invalid_entry",
      );
    const stamp = entry.slice(0, split);
    const time = Date.parse(stamp);
    if (Number.isNaN(time))
      simpleError(
        "entries",
        `Entry ${index + 1} has an invalid timestamp.`,
        "invalid_timestamp",
      );
    return { entry, time, index };
  });
  parsed.sort(
    (a, b) =>
      (input.order === "oldest-first" ? a.time - b.time : b.time - a.time) ||
      a.index - b.index,
  );
  return {
    sortedEntries: parsed.map((item) => item.entry),
    entryCount: parsed.length,
  };
};

export const exampleInput = {
  entries: ["2025-01-01T12:30:00Z|Update B", "2025-01-01T12:00:00Z|Update A"],
  order: "oldest-first",
} satisfies Input;
export const exampleOutput = {
  sortedEntries: [
    "2025-01-01T12:00:00Z|Update A",
    "2025-01-01T12:30:00Z|Update B",
  ],
  entryCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      entries: input.entries as readonly string[],
      order: input.order as string,
    }),
  description:
    "Sort timestamped live-blog entries in a caller-selected chronological direction.",
  id: "journalism/live-blog-chronology-sorter",
  inputs: [
    { id: "entries", label: "Live-blog entries", kind: "stringList" },
    {
      id: "order",
      label: "Sort order",
      kind: "string",
      enum: ["oldest-first", "newest-first"],
    },
  ],
  outputs: [
    { id: "sortedEntries", label: "Sorted entries", kind: "stringList" },
    { id: "entryCount", label: "Entry count", kind: "integer", minimum: 0 },
  ],
  title: "Live-Blog Chronology Sorter",
});

export const run = tool.execute;
export default tool;
