import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly dailyPrecipitationMm: readonly number[];
  readonly callerBaselineWetDay95thPercentileMm: number;
  readonly callerWetDayThresholdMm: number;
}>;
export type Output = Readonly<{
  readonly heavyPrecipitationTotalMm: number;
  readonly wetPrecipitationTotalMm: number;
  readonly r95pFraction: number;
}>;
const inputFields = [
  {
    id: "dailyPrecipitationMm",
    label: "Daily precipitation mm",
    kind: "numberList",
  },
  {
    id: "callerBaselineWetDay95thPercentileMm",
    label: "Caller baseline wet day95th percentile mm",
    kind: "number",
  },
  {
    id: "callerWetDayThresholdMm",
    label: "Caller wet day threshold mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWetDayThresholdMm, "callerWetDayThresholdMm");
  input.dailyPrecipitationMm.forEach((v) =>
    nonnegative(v, "dailyPrecipitationMm"),
  );
  nonnegative(
    input.callerBaselineWetDay95thPercentileMm,
    "callerBaselineWetDay95thPercentileMm",
  );
  if (
    input.callerBaselineWetDay95thPercentileMm < input.callerWetDayThresholdMm
  )
    simpleError(
      "percentile",
      "Baseline wet-day percentile must meet wet threshold.",
    );
  const wet = input.dailyPrecipitationMm.filter(
      (v) => v >= input.callerWetDayThresholdMm,
    ),
    wetPrecipitationTotalMm = positive(
      wet.reduce((a, b) => a + b, 0),
      "wetTotal",
    ),
    heavyPrecipitationTotalMm = wet
      .filter((v) => v > input.callerBaselineWetDay95thPercentileMm)
      .reduce((a, b) => a + b, 0);
  return {
    heavyPrecipitationTotalMm,
    wetPrecipitationTotalMm,
    r95pFraction: heavyPrecipitationTotalMm / wetPrecipitationTotalMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyPrecipitationMm: [0, 1, 3, 6],
  callerBaselineWetDay95thPercentileMm: 3,
  callerWetDayThresholdMm: 1,
} satisfies Input;
export const exampleOutput = {
  heavyPrecipitationTotalMm: 6,
  wetPrecipitationTotalMm: 10,
  r95pFraction: 0.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/r95p-fraction",
  title: "R95p Heavy Precipitation Fraction",
  description:
    "Compute R95p share on strict exceedance of a caller independently established baseline wet-day 95th percentile; ties are not exceedances and the analysis period is not silently its own baseline.",
  inputs: inputFields,
  outputs: [
    {
      id: "heavyPrecipitationTotalMm",
      label: "Heavy precipitation total mm",
      kind: "number",
    },
    {
      id: "wetPrecipitationTotalMm",
      label: "Wet precipitation total mm",
      kind: "number",
    },
    { id: "r95pFraction", label: "R95p fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      dailyPrecipitationMm: value.dailyPrecipitationMm as readonly number[],
      callerBaselineWetDay95thPercentileMm:
        value.callerBaselineWetDay95thPercentileMm as number,
      callerWetDayThresholdMm: value.callerWetDayThresholdMm as number,
    }),
});
export const run = tool.execute;
export default tool;
