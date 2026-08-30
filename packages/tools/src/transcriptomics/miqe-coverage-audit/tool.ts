import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requiredItems: readonly string[];
  readonly documentedItems: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchedItems: readonly string[];
  readonly missingItems: readonly string[];
  readonly coveragePercent: number;
}>;

export const calculate = (input: Input): Output => {
  const required = [
      ...new Set(input.requiredItems.map((v) => v.trim().toLowerCase())),
    ],
    observed = new Set(
      input.documentedItems.map((v) => v.trim().toLowerCase()),
    );
  if (required.length === 0 || required.includes(""))
    simpleError(
      "requiredItems",
      "Nonempty required checklist items are needed.",
    );
  const matchedItems = required.filter((v) => observed.has(v)),
    missingItems = required.filter((v) => !observed.has(v));
  return {
    matchedItems,
    missingItems,
    coveragePercent: (matchedItems.length / required.length) * 100,
  };
};

export const exampleInput = {
  requiredItems: ["primer-efficiency", "ntc", "replicates"],
  documentedItems: ["replicates", "ntc"],
} satisfies Input;
export const exampleOutput = {
  matchedItems: ["ntc", "replicates"],
  missingItems: ["primer-efficiency"],
  coveragePercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/miqe-coverage-audit",
  title: "MIQE Coverage Audit",
  description: "Audit caller-supplied MIQE reporting checklist coverage.",
  inputs: [
    { id: "requiredItems", kind: "stringList", label: "Required items" },
    { id: "documentedItems", kind: "stringList", label: "Documented items" },
  ],
  outputs: [
    { id: "matchedItems", kind: "stringList", label: "Matched items" },
    { id: "missingItems", kind: "stringList", label: "Missing items" },
    { id: "coveragePercent", kind: "number", label: "Coverage percent" },
  ],
  calculate: (value) =>
    calculate({
      requiredItems: value.requiredItems as readonly string[],
      documentedItems: value.documentedItems as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
