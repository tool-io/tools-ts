import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly earliestExposureDays: readonly number[];
  readonly latestExposureDays: readonly number[];
  readonly onsetDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly minimumIncubationDays: readonly number[];
  readonly maximumIncubationDays: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.earliestExposureDays,
    input.latestExposureDays,
    "earliestExposureDays",
  );
  aligned(input.earliestExposureDays, input.onsetDays, "earliestExposureDays");
  if (
    input.earliestExposureDays.some(
      (v, i) =>
        v > input.latestExposureDays[i] ||
        input.latestExposureDays[i] > input.onsetDays[i],
    )
  )
    simpleError(
      "latestExposureDays",
      "Exposure windows must be ordered and end before or at onset.",
    );
  return {
    minimumIncubationDays: input.onsetDays.map(
      (v, i) => v - input.latestExposureDays[i],
    ),
    maximumIncubationDays: input.onsetDays.map(
      (v, i) => v - input.earliestExposureDays[i],
    ),
  };
};
export const exampleInput = {
  earliestExposureDays: [0, 1],
  latestExposureDays: [2, 3],
  onsetDays: [7, 9],
} satisfies Input;
export const exampleOutput = {
  minimumIncubationDays: [5, 6],
  maximumIncubationDays: [7, 8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/incubation-exposure-bounds",
  title: "Incubation Exposure Bounds",
  description:
    "Derive interval-censored incubation bounds from exposure windows and symptom onsets.",
  inputs: [
    {
      id: "earliestExposureDays",
      label: "Earliest exposure days",
      kind: "numberList",
    },
    {
      id: "latestExposureDays",
      label: "Latest exposure days",
      kind: "numberList",
    },
    { id: "onsetDays", label: "Onset days", kind: "numberList" },
  ],
  outputs: [
    {
      id: "minimumIncubationDays",
      label: "Minimum incubation days",
      kind: "numberList",
    },
    {
      id: "maximumIncubationDays",
      label: "Maximum incubation days",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      earliestExposureDays: value.earliestExposureDays as readonly number[],
      latestExposureDays: value.latestExposureDays as readonly number[],
      onsetDays: value.onsetDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
