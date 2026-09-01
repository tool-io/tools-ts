import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly observedBaselinesPx: readonly number[];
  readonly gridOriginPx: number;
  readonly gridStepPx: number;
  readonly callerMaximumGridErrorPx: number;
}>;
export type Output = Readonly<{
  readonly signedNearestGridErrorsPx: readonly number[];
  readonly offCallerGridFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBaselinesPx",
    label: "Observed baselines px",
    kind: "numberList",
  },
  { id: "gridOriginPx", label: "Grid origin px", kind: "number" },
  { id: "gridStepPx", label: "Grid step px", kind: "number" },
  {
    id: "callerMaximumGridErrorPx",
    label: "Caller maximum grid error px",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.gridStepPx, "gridStepPx");
  nonnegative(input.callerMaximumGridErrorPx, "callerMaximumGridErrorPx");
  if (!input.observedBaselinesPx.length)
    simpleError("baselines", "Observed baseline ledger required.");
  const d = input.observedBaselinesPx.map(
    (v) =>
      v -
      input.gridOriginPx -
      Math.round((v - input.gridOriginPx) / input.gridStepPx) *
        input.gridStepPx,
  );
  return {
    signedNearestGridErrorsPx: d,
    offCallerGridFlags: d.map((v) =>
      Math.abs(v) > input.callerMaximumGridErrorPx ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBaselinesPx: [10, 22, 35],
  gridOriginPx: 10,
  gridStepPx: 12,
  callerMaximumGridErrorPx: 0.5,
} satisfies Input;
export const exampleOutput = {
  signedNearestGridErrorsPx: [0, 0, 1],
  offCallerGridFlags: [0, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/baseline-grid-align-checker",
  title: "Baseline Grid Align Checker",
  description:
    "Audit multiple actual baselines against anchored grid and caller tolerance, preserving signed residuals; unlike existing single-baseline rounding, no adjusted positions are prescribed.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedNearestGridErrorsPx",
      label: "Signed nearest grid errors px",
      kind: "numberList",
    },
    {
      id: "offCallerGridFlags",
      label: "Off caller grid flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBaselinesPx: value.observedBaselinesPx as readonly number[],
      gridOriginPx: value.gridOriginPx as number,
      gridStepPx: value.gridStepPx as number,
      callerMaximumGridErrorPx: value.callerMaximumGridErrorPx as number,
    }),
});
export const run = tool.execute;
export default tool;
