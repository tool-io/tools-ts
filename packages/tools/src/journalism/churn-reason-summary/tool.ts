import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly reasons: readonly string[];
}>;
export type Output = Readonly<{
  readonly reasonCounts: readonly string[];
  readonly mostCommonReason: string;
  readonly uniqueReasonCount: number;
}>;

export const calculate = (input: Input): Output => {
  const counts = new Map<string, number>();
  for (const raw of input.reasons) {
    const reason = raw.trim().toLocaleLowerCase("en-US");
    if (reason.length === 0)
      simpleError("reasons", "Reasons must not be empty.", "empty_reason");
    counts.set(reason, (counts.get(reason) ?? 0) + 1);
  }
  const entries = [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
  return {
    reasonCounts: entries.map(([reason, count]) => `${reason}: ${count}`),
    mostCommonReason: entries[0]?.[0] ?? "none",
    uniqueReasonCount: entries.length,
  };
};

export const exampleInput = {
  reasons: ["price", "coverage", "Price", "price"],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = { reasons: [] } satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      reasons: input.reasons as readonly string[],
    }),
  description: "Normalize and count supplied churn-reason labels.",
  id: "journalism/churn-reason-summary",
  inputs: [{ id: "reasons", label: "Churn reasons", kind: "stringList" }],
  outputs: [
    {
      id: "reasonCounts",
      label: "Normalized reason counts",
      kind: "stringList",
    },
    { id: "mostCommonReason", label: "Most common reason", kind: "string" },
    {
      id: "uniqueReasonCount",
      label: "Unique reason count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Churn Reason Summary",
});

export const run = tool.execute;
export default tool;
