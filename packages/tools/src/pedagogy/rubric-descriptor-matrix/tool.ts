import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly criteria: readonly string[];
  readonly levels: readonly string[];
  readonly descriptors: readonly string[];
}>;
export type Output = Readonly<{
  readonly cells: readonly string[];
  readonly missingCellIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const { criteria, levels, descriptors } = input;
  if (
    !criteria.length ||
    !levels.length ||
    new Set(criteria).size !== criteria.length ||
    new Set(levels).size !== levels.length ||
    descriptors.length !== criteria.length * levels.length
  )
    simpleError(
      "descriptors",
      "Exactly one descriptor per criterion-level cell required.",
    );
  const cells = descriptors.map(
    (value, i) =>
      `${criteria[Math.floor(i / levels.length)]}/${levels[i % levels.length]}: ${value.trim()}`,
  );
  return {
    cells,
    missingCellIndexes: descriptors.flatMap((v, i) => (v.trim() ? [] : [i])),
  };
};
export const exampleInput = {
  criteria: ["accuracy", "clarity"],
  levels: ["basic", "strong"],
  descriptors: ["few correct", "all correct", "unclear", "clear"],
} satisfies Input;
export const exampleOutput = {
  cells: [
    "accuracy/basic: few correct",
    "accuracy/strong: all correct",
    "clarity/basic: unclear",
    "clarity/strong: clear",
  ],
  missingCellIndexes: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/rubric-descriptor-matrix",
  title: "Rubric Descriptor Matrix",
  description:
    "Build a criterion-by-performance-level rubric from caller descriptors.",
  inputs: [
    { id: "criteria", label: "Criteria", kind: "stringList" },
    { id: "levels", label: "Levels", kind: "stringList" },
    { id: "descriptors", label: "Descriptors", kind: "stringList" },
  ],
  outputs: [
    { id: "cells", label: "Cells", kind: "stringList" },
    {
      id: "missingCellIndexes",
      label: "Missing cell indexes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      criteria: value.criteria as readonly string[],
      levels: value.levels as readonly string[],
      descriptors: value.descriptors as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
