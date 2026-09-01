import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sum,
  matrixFlags,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedIrrigationZoneLitersMinute: readonly number[];
  readonly callerSimultaneousZoneFlags: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly callerConcurrentIrrigationFlowsLitersMinute: readonly number[];
  readonly maximumCallerConcurrentIrrigationLitersMinute: number;
}>;
const inputFields = [
  {
    id: "observedIrrigationZoneLitersMinute",
    label: "Observed irrigation zone liters minute",
    kind: "numberList",
  },
  {
    id: "callerSimultaneousZoneFlags",
    label: "Caller simultaneous zone flags",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIrrigationZoneLitersMinute.forEach((v) =>
    nonnegative(v, "observedIrrigationZoneLitersMinute"),
  );
  matrixFlags(
    input.callerSimultaneousZoneFlags,
    input.observedIrrigationZoneLitersMinute.length,
  );
  const flow = input.callerSimultaneousZoneFlags.map((r) =>
    sum(r.map((v, i) => v * input.observedIrrigationZoneLitersMinute[i])),
  );
  return {
    callerConcurrentIrrigationFlowsLitersMinute: flow,
    maximumCallerConcurrentIrrigationLitersMinute: Math.max(...flow),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIrrigationZoneLitersMinute: [10, 20, 30],
  callerSimultaneousZoneFlags: [
    [1, 0, 1],
    [0, 1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  callerConcurrentIrrigationFlowsLitersMinute: [40, 20],
  maximumCallerConcurrentIrrigationLitersMinute: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/irrigation-flow-rate",
  title: "Plumbing Irrigation Flow Rate Calculator",
  description:
    "Inventory actual irrigation zone flows under explicit caller simultaneous-zone scenarios; no all-zones-always-on assumption, plant water demand or pump sizing guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerConcurrentIrrigationFlowsLitersMinute",
      label: "Caller concurrent irrigation flows liters minute",
      kind: "numberList",
    },
    {
      id: "maximumCallerConcurrentIrrigationLitersMinute",
      label: "Maximum caller concurrent irrigation liters minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIrrigationZoneLitersMinute:
        value.observedIrrigationZoneLitersMinute as readonly number[],
      callerSimultaneousZoneFlags:
        value.callerSimultaneousZoneFlags as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
