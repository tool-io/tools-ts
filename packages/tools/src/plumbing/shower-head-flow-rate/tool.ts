import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedShowerTimedLiters: readonly number[];
  readonly observedShowerTimedMinutes: readonly number[];
  readonly callerPlannedShowerMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedShowerLitersMinute: readonly number[];
  readonly plannedShowerWaterLiters: readonly number[];
  readonly totalPlannedShowerLiters: number;
}>;
const inputFields = [
  {
    id: "observedShowerTimedLiters",
    label: "Observed shower timed liters",
    kind: "numberList",
  },
  {
    id: "observedShowerTimedMinutes",
    label: "Observed shower timed minutes",
    kind: "numberList",
  },
  {
    id: "callerPlannedShowerMinutes",
    label: "Caller planned shower minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedShowerTimedMinutes.forEach((v) =>
    positive(v, "observedShowerTimedMinutes"),
  );
  input.observedShowerTimedLiters.forEach((v) =>
    nonnegative(v, "observedShowerTimedLiters"),
  );
  input.callerPlannedShowerMinutes.forEach((v) =>
    nonnegative(v, "callerPlannedShowerMinutes"),
  );
  aligned(
    input.observedShowerTimedLiters,
    input.observedShowerTimedMinutes,
    "observedShowerTimedLiters",
  );
  aligned(
    input.observedShowerTimedLiters,
    input.callerPlannedShowerMinutes,
    "observedShowerTimedLiters",
  );
  const flows = input.observedShowerTimedLiters.map(
      (v, i) => v / input.observedShowerTimedMinutes[i],
    ),
    volumes = flows.map((v, i) => v * input.callerPlannedShowerMinutes[i]);
  return {
    observedShowerLitersMinute: flows,
    plannedShowerWaterLiters: volumes,
    totalPlannedShowerLiters: sum(volumes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShowerTimedLiters: [5, 10],
  observedShowerTimedMinutes: [1, 2],
  callerPlannedShowerMinutes: [5, 10],
} satisfies Input;
export const exampleOutput = {
  observedShowerLitersMinute: [5, 5],
  plannedShowerWaterLiters: [25, 50],
  totalPlannedShowerLiters: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/shower-head-flow-rate",
  title: "Plumbing Shower Head Flow Rate Calculator",
  description:
    "Budget actual independently timed shower flow at caller usage durations; distinct from faucet collection-only calibration and no assumed household frequency.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedShowerLitersMinute",
      label: "Observed shower liters minute",
      kind: "numberList",
    },
    {
      id: "plannedShowerWaterLiters",
      label: "Planned shower water liters",
      kind: "numberList",
    },
    {
      id: "totalPlannedShowerLiters",
      label: "Total planned shower liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShowerTimedLiters:
        value.observedShowerTimedLiters as readonly number[],
      observedShowerTimedMinutes:
        value.observedShowerTimedMinutes as readonly number[],
      callerPlannedShowerMinutes:
        value.callerPlannedShowerMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
