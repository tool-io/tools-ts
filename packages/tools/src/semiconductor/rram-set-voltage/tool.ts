import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedRramSetPulseV: readonly number[];
  readonly observedRramSetPostPulseMetric: readonly number[];
  readonly callerSetConductanceCriterion: number;
}>;
export type Output = Readonly<{
  readonly measuredRramSetThresholdCrossingsV: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRramSetPulseV",
    label: "Observed rram set pulse v",
    kind: "numberList",
  },
  {
    id: "observedRramSetPostPulseMetric",
    label: "Observed rram set post pulse metric",
    kind: "numberList",
  },
  {
    id: "callerSetConductanceCriterion",
    label: "Caller set conductance criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRramSetPulseV.forEach((v) =>
    nonnegative(v, "observedRramSetPulseV"),
  );
  input.observedRramSetPostPulseMetric.forEach((v) =>
    nonnegative(v, "observedRramSetPostPulseMetric"),
  );
  nonnegative(
    input.callerSetConductanceCriterion,
    "callerSetConductanceCriterion",
  );
  return {
    measuredRramSetThresholdCrossingsV: crossings(
      input.observedRramSetPulseV,
      input.observedRramSetPostPulseMetric,
      input.callerSetConductanceCriterion,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRramSetPulseV: [0, 1, 2],
  observedRramSetPostPulseMetric: [0, 2, 4],
  callerSetConductanceCriterion: 3,
} satisfies Input;
export const exampleOutput = {
  measuredRramSetThresholdCrossingsV: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/rram-set-voltage",
  title: "Semiconductor RRAM Set Voltage Calculator",
  description:
    "Extract all actual piecewise-linear measuredRramSetThresholdCrossingsV test crossings at explicitly supplied callerSetConductanceCriterion, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredRramSetThresholdCrossingsV",
      label: "Measured rram set threshold crossings v",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRramSetPulseV: value.observedRramSetPulseV as readonly number[],
      observedRramSetPostPulseMetric:
        value.observedRramSetPostPulseMetric as readonly number[],
      callerSetConductanceCriterion:
        value.callerSetConductanceCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
