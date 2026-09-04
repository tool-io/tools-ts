import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  empiricalConfusion,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyVerifiedActualEventFlags: readonly number[];
  readonly recordedGroundhogPredictionFlags: readonly number[];
  readonly pairedObservationKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedActualEventFlags",
    label: "Independently verified actual event flags",
    kind: "numberList",
  },
  {
    id: "recordedGroundhogPredictionFlags",
    label: "Recorded groundhog prediction flags",
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
    input.independentlyVerifiedActualEventFlags,
    input.recordedGroundhogPredictionFlags,
    input.pairedObservationKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedActualEventFlags: [1, 0, 1, 0],
    recordedGroundhogPredictionFlags: [1, 1, 1, 0],
    pairedObservationKnownFlags: [1, 1, 0, 1],
  },
  output: {
    result: {
      correctKnownCount: 2,
      incorrectKnownCount: 1,
      unknownCount: 1,
      observedKnownAccuracy: 0.6666666666666666,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/groundhog-day-punxsutawney-phil-accuracy-statistics",
  title: "Groundhog Day Punxsutawney Phil Accuracy Statistics",
  description:
    "Observed accuracy of actual predefined Groundhog-Dayprediction/event pairs within caller independently verified location, period, lead-time and outcome definition. Unknown observations retained; no fabricated Phil accuracy percentage or climatological skill.",
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
