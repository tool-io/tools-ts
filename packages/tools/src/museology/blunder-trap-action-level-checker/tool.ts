import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly trapCatchCounts: readonly number[];
  readonly exposedTrapDays: readonly number[];
  readonly callerActionCatchRatePerTrapDay: number;
}>;
export type Output = Readonly<{
  readonly catchRatesPerTrapDay: readonly number[];
  readonly callerActionFlags: readonly number[];
  readonly pooledCatchRatePerTrapDay: number;
}>;
const inputFields = [
  { id: "trapCatchCounts", label: "Trap catch counts", kind: "numberList" },
  { id: "exposedTrapDays", label: "Exposed trap days", kind: "numberList" },
  {
    id: "callerActionCatchRatePerTrapDay",
    label: "Caller action catch rate per trap day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.exposedTrapDays.forEach((v) => positive(v, "exposedTrapDays"));
  nonnegative(
    input.callerActionCatchRatePerTrapDay,
    "callerActionCatchRatePerTrapDay",
  );
  input.trapCatchCounts.forEach((v) => count(v, "trapCatchCounts"));
  aligned(input.trapCatchCounts, input.exposedTrapDays, "trapCatchCounts");
  const r = input.trapCatchCounts.map((v, i) => v / input.exposedTrapDays[i]);
  return {
    catchRatesPerTrapDay: r,
    callerActionFlags: r.map((v) =>
      v > input.callerActionCatchRatePerTrapDay ? 1 : 0,
    ),
    pooledCatchRatePerTrapDay:
      sum(input.trapCatchCounts) / sum(input.exposedTrapDays),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trapCatchCounts: [2, 10],
  exposedTrapDays: [2, 5],
  callerActionCatchRatePerTrapDay: 1,
} satisfies Input;
export const exampleOutput = {
  catchRatesPerTrapDay: [1, 2],
  callerActionFlags: [0, 1],
  pooledCatchRatePerTrapDay: 1.7142857142857142,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/blunder-trap-action-level-checker",
  title: "Blunder Trap Catch Threshold Action Level Checker",
  description:
    "Audit catches per actual trap-day exposure under caller action threshold, preserving exposure heterogeneity; no pest identification or inferred infestation/treatment need.",
  inputs: inputFields,
  outputs: [
    {
      id: "catchRatesPerTrapDay",
      label: "Catch rates per trap day",
      kind: "numberList",
    },
    {
      id: "callerActionFlags",
      label: "Caller action flags",
      kind: "numberList",
    },
    {
      id: "pooledCatchRatePerTrapDay",
      label: "Pooled catch rate per trap day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      trapCatchCounts: value.trapCatchCounts as readonly number[],
      exposedTrapDays: value.exposedTrapDays as readonly number[],
      callerActionCatchRatePerTrapDay:
        value.callerActionCatchRatePerTrapDay as number,
    }),
});
export const run = tool.execute;
export default tool;
