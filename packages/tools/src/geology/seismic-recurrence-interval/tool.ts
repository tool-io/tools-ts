import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  mean,
  strictlyIncreasing,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualQualifyingEventTimesYears: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualQualifyingEventTimesYears",
    label: "Actual qualifying event times years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  strictlyIncreasing(input.actualQualifyingEventTimesYears, "event-times", 2);
  const t = input.actualQualifyingEventTimesYears
    .slice(1)
    .map((v, i) => v - input.actualQualifyingEventTimesYears[i]);
  return {
    observedIntereventIntervalsYears: t,
    observedMeanIntervalYears: mean(t),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQualifyingEventTimesYears: [1, 3, 6] },
  output: {
    result: {
      observedIntereventIntervalsYears: [2, 3],
      observedMeanIntervalYears: 2.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/seismic-recurrence-interval",
  title: "Geology Seismic Recurrence Interval Calculator",
  description:
    "Actual ordered qualifying seismic event intervals and mean, not probabilistic recurrence return period from a missing catalog or next-earthquake prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedIntereventIntervalsYears: {
            type: "array",
            items: { type: "number" },
          },
          observedMeanIntervalYears: { type: "number" },
        },
        required: [
          "observedIntereventIntervalsYears",
          "observedMeanIntervalYears",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
