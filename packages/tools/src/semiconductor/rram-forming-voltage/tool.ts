import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedRramFormingPulseV: readonly number[];
  readonly observedRramFormingPostPulseMetric: readonly number[];
  readonly callerFormedConductanceCriterion: number;
}>;
export type Output = Readonly<{
  readonly measuredRramFormingThresholdCrossingsV: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRramFormingPulseV",
    label: "Observed rram forming pulse v",
    kind: "numberList",
  },
  {
    id: "observedRramFormingPostPulseMetric",
    label: "Observed rram forming post pulse metric",
    kind: "numberList",
  },
  {
    id: "callerFormedConductanceCriterion",
    label: "Caller formed conductance criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRramFormingPulseV.forEach((v) =>
    nonnegative(v, "observedRramFormingPulseV"),
  );
  input.observedRramFormingPostPulseMetric.forEach((v) =>
    nonnegative(v, "observedRramFormingPostPulseMetric"),
  );
  nonnegative(
    input.callerFormedConductanceCriterion,
    "callerFormedConductanceCriterion",
  );
  return {
    measuredRramFormingThresholdCrossingsV: crossings(
      input.observedRramFormingPulseV,
      input.observedRramFormingPostPulseMetric,
      input.callerFormedConductanceCriterion,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRramFormingPulseV: [0, 1, 2],
  observedRramFormingPostPulseMetric: [0, 2, 4],
  callerFormedConductanceCriterion: 3,
} satisfies Input;
export const exampleOutput = {
  measuredRramFormingThresholdCrossingsV: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/rram-forming-voltage",
  title: "Semiconductor RRAM Forming Voltage Calculator",
  description:
    "Extract all actual piecewise-linear measuredRramFormingThresholdCrossingsV test crossings at explicitly supplied callerFormedConductanceCriterion, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredRramFormingThresholdCrossingsV",
      label: "Measured rram forming threshold crossings v",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRramFormingPulseV:
        value.observedRramFormingPulseV as readonly number[],
      observedRramFormingPostPulseMetric:
        value.observedRramFormingPostPulseMetric as readonly number[],
      callerFormedConductanceCriterion:
        value.callerFormedConductanceCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
