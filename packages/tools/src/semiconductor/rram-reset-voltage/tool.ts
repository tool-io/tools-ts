import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedRramResetPulseV: readonly number[];
  readonly observedRramResetPostPulseMetric: readonly number[];
  readonly callerResetResistanceCriterion: number;
}>;
export type Output = Readonly<{
  readonly measuredRramResetThresholdCrossingsV: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRramResetPulseV",
    label: "Observed rram reset pulse v",
    kind: "numberList",
  },
  {
    id: "observedRramResetPostPulseMetric",
    label: "Observed rram reset post pulse metric",
    kind: "numberList",
  },
  {
    id: "callerResetResistanceCriterion",
    label: "Caller reset resistance criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRramResetPulseV.forEach((v) =>
    nonnegative(v, "observedRramResetPulseV"),
  );
  input.observedRramResetPostPulseMetric.forEach((v) =>
    nonnegative(v, "observedRramResetPostPulseMetric"),
  );
  nonnegative(
    input.callerResetResistanceCriterion,
    "callerResetResistanceCriterion",
  );
  return {
    measuredRramResetThresholdCrossingsV: crossings(
      input.observedRramResetPulseV,
      input.observedRramResetPostPulseMetric,
      input.callerResetResistanceCriterion,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRramResetPulseV: [0, 1, 2],
  observedRramResetPostPulseMetric: [0, 2, 4],
  callerResetResistanceCriterion: 3,
} satisfies Input;
export const exampleOutput = {
  measuredRramResetThresholdCrossingsV: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/rram-reset-voltage",
  title: "Semiconductor RRAM Reset Voltage Calculator",
  description:
    "Extract all actual piecewise-linear measuredRramResetThresholdCrossingsV test crossings at explicitly supplied callerResetResistanceCriterion, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredRramResetThresholdCrossingsV",
      label: "Measured rram reset threshold crossings v",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRramResetPulseV:
        value.observedRramResetPulseV as readonly number[],
      observedRramResetPostPulseMetric:
        value.observedRramResetPostPulseMetric as readonly number[],
      callerResetResistanceCriterion:
        value.callerResetResistanceCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
