import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedLinePositionsM: readonly number[];
  readonly callerDesiredSpacingM: number;
  readonly callerGapToleranceM: number;
}>;
export type Output = Readonly<{
  readonly observedAdjacentGapsM: readonly number[];
  readonly signedAdjacentSpacingErrorsM: readonly number[];
  readonly gapsOutsideCallerSpacingTolerance: readonly number[];
}>;
const inputFields = [
  {
    id: "observedLinePositionsM",
    label: "Observed line positions m",
    kind: "numberList",
  },
  {
    id: "callerDesiredSpacingM",
    label: "Caller desired spacing m",
    kind: "number",
  },
  {
    id: "callerGapToleranceM",
    label: "Caller gap tolerance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerDesiredSpacingM, "callerDesiredSpacingM");
  nonnegative(input.callerGapToleranceM, "callerGapToleranceM");
  strictlyIncreasing(input.observedLinePositionsM, "line");
  const gaps = input.observedLinePositionsM
      .slice(1)
      .map((v, i) => v - input.observedLinePositionsM[i]),
    d = gaps.map((v) => v - input.callerDesiredSpacingM);
  return {
    observedAdjacentGapsM: gaps,
    signedAdjacentSpacingErrorsM: d,
    gapsOutsideCallerSpacingTolerance: d.flatMap((v, i) =>
      Math.abs(v) > input.callerGapToleranceM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLinePositionsM: [0, 1, 2.2, 3],
  callerDesiredSpacingM: 1,
  callerGapToleranceM: 0.1,
} satisfies Input;
export const exampleOutput = {
  observedAdjacentGapsM: [1, 1.2, 0.8],
  signedAdjacentSpacingErrorsM: [0, 0.2, -0.2],
  gapsOutsideCallerSpacingTolerance: [1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/line-spacing-even-interval-checker",
  title: "Line Spacing Even Interval Checker",
  description:
    "Audit actual ordered one-axis dance line gaps against caller desired interval/tolerance; not inferred uniform placement, geodesy or inter-dancer clearance safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAdjacentGapsM",
      label: "Observed adjacent gaps m",
      kind: "numberList",
    },
    {
      id: "signedAdjacentSpacingErrorsM",
      label: "Signed adjacent spacing errors m",
      kind: "numberList",
    },
    {
      id: "gapsOutsideCallerSpacingTolerance",
      label: "Gaps outside caller spacing tolerance",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLinePositionsM: value.observedLinePositionsM as readonly number[],
      callerDesiredSpacingM: value.callerDesiredSpacingM as number,
      callerGapToleranceM: value.callerGapToleranceM as number,
    }),
});
export const run = tool.execute;
export default tool;
