import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly headingSizesDescendingPx: readonly number[];
  readonly callerTargetStepRatio: number;
  readonly callerRelativeRatioTolerance: number;
}>;
export type Output = Readonly<{
  readonly adjacentHeadingStepRatios: readonly number[];
  readonly inconsistentStepIndices: readonly number[];
  readonly strictDescendingHierarchy: boolean;
}>;
const inputFields = [
  {
    id: "headingSizesDescendingPx",
    label: "Heading sizes descending px",
    kind: "numberList",
  },
  {
    id: "callerTargetStepRatio",
    label: "Caller target step ratio",
    kind: "number",
  },
  {
    id: "callerRelativeRatioTolerance",
    label: "Caller relative ratio tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.headingSizesDescendingPx.forEach((v) =>
    positive(v, "headingSizesDescendingPx"),
  );
  positive(input.callerTargetStepRatio, "callerTargetStepRatio");
  nonnegative(
    input.callerRelativeRatioTolerance,
    "callerRelativeRatioTolerance",
  );
  if (input.headingSizesDescendingPx.length < 2)
    simpleError("sizes", "At least two measured heading sizes required.");
  const r = input.headingSizesDescendingPx
    .slice(1)
    .map((v, i) => input.headingSizesDescendingPx[i] / v);
  return {
    adjacentHeadingStepRatios: r,
    inconsistentStepIndices: r.flatMap((v, i) =>
      Math.abs(v / input.callerTargetStepRatio - 1) >
      input.callerRelativeRatioTolerance
        ? [i]
        : [],
    ),
    strictDescendingHierarchy: r.every((v) => v > 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  headingSizesDescendingPx: [32, 24, 18],
  callerTargetStepRatio: 1.3333333333333333,
  callerRelativeRatioTolerance: 0.01,
} satisfies Input;
export const exampleOutput = {
  adjacentHeadingStepRatios: [1.3333333333333333, 1.3333333333333333],
  inconsistentStepIndices: [],
  strictDescendingHierarchy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/heading-step-consistency-checker",
  title: "Heading Step Consistency Checker",
  description:
    "Audit actual hierarchy adjacent ratios under caller scale and tolerance, retaining reversals/equal sizes; differs from generating an ideal modular scale.",
  inputs: inputFields,
  outputs: [
    {
      id: "adjacentHeadingStepRatios",
      label: "Adjacent heading step ratios",
      kind: "numberList",
    },
    {
      id: "inconsistentStepIndices",
      label: "Inconsistent step indices",
      kind: "numberList",
    },
    {
      id: "strictDescendingHierarchy",
      label: "Strict descending hierarchy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      headingSizesDescendingPx:
        value.headingSizesDescendingPx as readonly number[],
      callerTargetStepRatio: value.callerTargetStepRatio as number,
      callerRelativeRatioTolerance:
        value.callerRelativeRatioTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
