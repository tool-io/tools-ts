import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly generationIndexes: readonly number[];
  readonly affectedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly affectedGenerations: readonly number[];
  readonly longestAffectedRun: number;
  readonly verticalPattern: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.generationIndexes, input.affectedFlags, "generationIndexes");
  input.generationIndexes.forEach((v) => count(v, "generationIndexes"));
  if (input.affectedFlags.some((v) => v !== 0 && v !== 1))
    simpleError("affectedFlags", "Binary phenotype flags required.");
  const affectedGenerations = [
    ...new Set(
      input.generationIndexes.filter((_, i) => input.affectedFlags[i] === 1),
    ),
  ].sort((a, b) => a - b);
  let longestAffectedRun = 0,
    run = 0;
  affectedGenerations.forEach((v, i) => {
    run = i > 0 && v === affectedGenerations[i - 1] + 1 ? run + 1 : 1;
    longestAffectedRun = Math.max(longestAffectedRun, run);
  });
  return {
    affectedGenerations,
    longestAffectedRun,
    verticalPattern: longestAffectedRun >= 2,
  };
};
export const exampleInput = {
  generationIndexes: [0, 1, 2, 2],
  affectedFlags: [1, 1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  affectedGenerations: [0, 1, 2],
  longestAffectedRun: 3,
  verticalPattern: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/dominant-generation-pedigree-pattern",
  title: "Dominant Generation Pedigree Pattern",
  description:
    "Summarize consecutive affected pedigree generations as evidence consistent with vertical inheritance.",
  inputs: [
    {
      id: "generationIndexes",
      label: "Generation indexes",
      kind: "numberList",
    },
    { id: "affectedFlags", label: "Affected flags", kind: "numberList" },
  ],
  outputs: [
    {
      id: "affectedGenerations",
      label: "Affected generations",
      kind: "numberList",
    },
    { id: "longestAffectedRun", label: "Longest affected run", kind: "number" },
    { id: "verticalPattern", label: "Vertical pattern", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      generationIndexes: value.generationIndexes as readonly number[],
      affectedFlags: value.affectedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
