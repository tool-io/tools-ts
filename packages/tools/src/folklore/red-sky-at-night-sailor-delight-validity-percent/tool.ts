import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  empiricalConfusion,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyVerifiedRainOutcomeFlags: readonly number[];
  readonly recordedRedSkyPredictionFlags: readonly number[];
  readonly pairedObservationKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedRainOutcomeFlags",
    label: "Independently verified rain outcome flags",
    kind: "numberList",
  },
  {
    id: "recordedRedSkyPredictionFlags",
    label: "Recorded red sky prediction flags",
    kind: "numberList",
  },
  {
    id: "pairedObservationKnownFlags",
    label: "Paired observation known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return empiricalConfusion(
    input.independentlyVerifiedRainOutcomeFlags,
    input.recordedRedSkyPredictionFlags,
    input.pairedObservationKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedRainOutcomeFlags: [0, 1, 0],
    recordedRedSkyPredictionFlags: [0, 0, 0],
    pairedObservationKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      correctKnownCount: 2,
      incorrectKnownCount: 1,
      unknownCount: 0,
      observedKnownAccuracy: 0.6666666666666666,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/red-sky-at-night-sailor-delight-validity-percent",
  title: "Red Sky At Night Sailor Delight Validity Percent",
  description:
    "Actual matched local red-sky forecast accuracy for a predefined rain outcome and lead time. Same cohort and independent observations required; no universal sailor-delight validity percentage or causal weather explanation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
