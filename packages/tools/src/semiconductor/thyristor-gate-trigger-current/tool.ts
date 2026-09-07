import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedGateTriggerAmps: readonly number[];
  readonly observedAnodeTurnOnMetric: readonly number[];
  readonly callerAnodeTurnOnCriterion: number;
}>;
export type Output = Readonly<{
  readonly measuredGateTriggerCurrentCrossingsAmps: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGateTriggerAmps",
    label: "Observed gate trigger amps",
    kind: "numberList",
  },
  {
    id: "observedAnodeTurnOnMetric",
    label: "Observed anode turn on metric",
    kind: "numberList",
  },
  {
    id: "callerAnodeTurnOnCriterion",
    label: "Caller anode turn on criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGateTriggerAmps.forEach((v) =>
    nonnegative(v, "observedGateTriggerAmps"),
  );
  input.observedAnodeTurnOnMetric.forEach((v) =>
    nonnegative(v, "observedAnodeTurnOnMetric"),
  );
  nonnegative(input.callerAnodeTurnOnCriterion, "callerAnodeTurnOnCriterion");
  return {
    measuredGateTriggerCurrentCrossingsAmps: crossings(
      input.observedGateTriggerAmps,
      input.observedAnodeTurnOnMetric,
      input.callerAnodeTurnOnCriterion,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGateTriggerAmps: [0, 1, 2],
  observedAnodeTurnOnMetric: [0, 2, 4],
  callerAnodeTurnOnCriterion: 3,
} satisfies Input;
export const exampleOutput = {
  measuredGateTriggerCurrentCrossingsAmps: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/thyristor-gate-trigger-current",
  title: "Semiconductor Thyristor Gate Trigger Current Calculator",
  description:
    "Extract all actual piecewise-linear measuredGateTriggerCurrentCrossingsAmps test crossings at explicitly supplied callerAnodeTurnOnCriterion, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredGateTriggerCurrentCrossingsAmps",
      label: "Measured gate trigger current crossings amps",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGateTriggerAmps:
        value.observedGateTriggerAmps as readonly number[],
      observedAnodeTurnOnMetric:
        value.observedAnodeTurnOnMetric as readonly number[],
      callerAnodeTurnOnCriterion: value.callerAnodeTurnOnCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
