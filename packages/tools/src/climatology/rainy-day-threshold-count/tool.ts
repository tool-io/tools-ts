import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
} from "../shared.js";

export type Input = Readonly<{
  readonly dailyPrecipitationMm: readonly number[];
  readonly callerRainThresholdsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly daysAtOrAboveThreshold: readonly number[];
  readonly qualifyingDayFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "dailyPrecipitationMm",
    label: "Daily precipitation mm",
    kind: "numberList",
  },
  {
    id: "callerRainThresholdsMm",
    label: "Caller rain thresholds mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.dailyPrecipitationMm.forEach((v) =>
    nonnegative(v, "dailyPrecipitationMm"),
  );
  input.callerRainThresholdsMm.forEach((v) =>
    nonnegative(v, "callerRainThresholdsMm"),
  );
  ordered(input.callerRainThresholdsMm, "thresholds");
  const n = positive(input.dailyPrecipitationMm.length, "observedDays");
  if (n * input.callerRainThresholdsMm.length > 1000000)
    simpleError("thresholds", "At most one million day-threshold comparisons.");
  const daysAtOrAboveThreshold = input.callerRainThresholdsMm.map(
    (t) => input.dailyPrecipitationMm.filter((v) => v >= t).length,
  );
  return {
    daysAtOrAboveThreshold,
    qualifyingDayFractions: daysAtOrAboveThreshold.map((v) => v / n),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyPrecipitationMm: [0, 1, 2, 5],
  callerRainThresholdsMm: [1, 3],
} satisfies Input;
export const exampleOutput = {
  daysAtOrAboveThreshold: [3, 1],
  qualifyingDayFractions: [0.75, 0.25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/rainy-day-threshold-count",
  title: "Rainy Days Threshold Counter",
  description:
    "Audit a supplied increasing rain-threshold policy over observed daily precipitation with coverage denominator; no missing-as-dry treatment or climate category lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "daysAtOrAboveThreshold",
      label: "Days at or above threshold",
      kind: "numberList",
    },
    {
      id: "qualifyingDayFractions",
      label: "Qualifying day fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyPrecipitationMm: value.dailyPrecipitationMm as readonly number[],
      callerRainThresholdsMm: value.callerRainThresholdsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
