import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly conceptIds: readonly string[];
  readonly visualConceptIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly pairedIds: readonly string[];
  readonly missingVisualIds: readonly string[];
  readonly coveragePercent: number;
}>;
export const calculate = (input: Input): Output => {
  const ids = input.conceptIds;
  if (
    !ids.length ||
    new Set(ids).size !== ids.length ||
    input.visualConceptIds.some((v) => !ids.includes(v))
  )
    simpleError(
      "visualConceptIds",
      "Distinct concepts and visuals aligned to known concepts required.",
    );
  const visual = new Set(input.visualConceptIds),
    pairedIds = ids.filter((v) => visual.has(v)),
    missingVisualIds = ids.filter((v) => !visual.has(v));
  return {
    pairedIds,
    missingVisualIds,
    coveragePercent: (100 * pairedIds.length) / ids.length,
  };
};
export const exampleInput = {
  conceptIds: ["A", "B"],
  visualConceptIds: ["A"],
} satisfies Input;
export const exampleOutput = {
  pairedIds: ["A"],
  missingVisualIds: ["B"],
  coveragePercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/dual-coding-pair-audit",
  title: "Dual Coding Pair Audit",
  description:
    "Audit which verbal concepts have a matching visual representation.",
  inputs: [
    { id: "conceptIds", label: "Concept ids", kind: "stringList" },
    { id: "visualConceptIds", label: "Visual concept ids", kind: "stringList" },
  ],
  outputs: [
    { id: "pairedIds", label: "Paired ids", kind: "stringList" },
    { id: "missingVisualIds", label: "Missing visual ids", kind: "stringList" },
    { id: "coveragePercent", label: "Coverage percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      conceptIds: value.conceptIds as readonly string[],
      visualConceptIds: value.visualConceptIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
