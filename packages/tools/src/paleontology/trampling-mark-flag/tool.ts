import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly markDepthWidthRatios: readonly number[];
  readonly markIntersectionCounts: readonly number[];
  readonly callerMaximumTramplingRatio: number;
  readonly callerMinimumIntersectionCount: number;
}>;
export type Output = Readonly<{
  readonly callerTramplingConfoundFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "markDepthWidthRatios",
    label: "Mark depth width ratios",
    kind: "numberList",
  },
  {
    id: "markIntersectionCounts",
    label: "Mark intersection counts",
    kind: "numberList",
  },
  {
    id: "callerMaximumTramplingRatio",
    label: "Caller maximum trampling ratio",
    kind: "number",
  },
  {
    id: "callerMinimumIntersectionCount",
    label: "Caller minimum intersection count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.markDepthWidthRatios.forEach((v) =>
    nonnegative(v, "markDepthWidthRatios"),
  );
  nonnegative(input.callerMaximumTramplingRatio, "callerMaximumTramplingRatio");
  input.markIntersectionCounts.forEach((v) =>
    count(v, "markIntersectionCounts"),
  );
  count(input.callerMinimumIntersectionCount, "callerMinimumIntersectionCount");
  aligned(
    input.markDepthWidthRatios,
    input.markIntersectionCounts,
    "markDepthWidthRatios",
  );
  return {
    callerTramplingConfoundFlags: input.markDepthWidthRatios.map((r, i) =>
      r <= input.callerMaximumTramplingRatio &&
      input.markIntersectionCounts[i] >= input.callerMinimumIntersectionCount
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  markDepthWidthRatios: [0.1, 0.4],
  markIntersectionCounts: [3, 0],
  callerMaximumTramplingRatio: 0.2,
  callerMinimumIntersectionCount: 2,
} satisfies Input;
export const exampleOutput = {
  callerTramplingConfoundFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/trampling-mark-flag",
  title: "Trampling Mark Misidentification Flag Checker",
  description:
    "Apply explicit caller shallow-mark/intersection confound screen; a flag preserves uncertain mark attribution and is not an automated trampling or cut-mark diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerTramplingConfoundFlags",
      label: "Caller trampling confound flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      markDepthWidthRatios: value.markDepthWidthRatios as readonly number[],
      markIntersectionCounts: value.markIntersectionCounts as readonly number[],
      callerMaximumTramplingRatio: value.callerMaximumTramplingRatio as number,
      callerMinimumIntersectionCount:
        value.callerMinimumIntersectionCount as number,
    }),
});
export const run = tool.execute;
export default tool;
