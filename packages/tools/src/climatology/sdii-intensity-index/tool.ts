import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly dailyPrecipitationMm: readonly number[];
  readonly callerWetDayThresholdMm: number;
}>;
export type Output = Readonly<{
  readonly wetDayCount: number;
  readonly totalWetDayPrecipitationMm: number;
  readonly simpleDailyIntensityMmPerWetDay: number;
}>;
const inputFields = [
  {
    id: "dailyPrecipitationMm",
    label: "Daily precipitation mm",
    kind: "numberList",
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
  const wet = input.dailyPrecipitationMm.filter(
      (v) => v >= input.callerWetDayThresholdMm,
    ),
    wetDayCount = positive(wet.length, "wetDayCount"),
    totalWetDayPrecipitationMm = wet.reduce((a, b) => a + b, 0);
  return {
    wetDayCount,
    totalWetDayPrecipitationMm,
    simpleDailyIntensityMmPerWetDay: totalWetDayPrecipitationMm / wetDayCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyPrecipitationMm: [0, 1, 3],
  callerWetDayThresholdMm: 1,
} satisfies Input;
export const exampleOutput = {
  wetDayCount: 2,
  totalWetDayPrecipitationMm: 4,
  simpleDailyIntensityMmPerWetDay: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/sdii-intensity-index",
  title: "Simple Daily Intensity Index SDII",
  description:
    "Compute SDII using observed precipitation only on wet days at caller inclusive threshold; zero observed wet days is undefined rather than inventing a daily intensity.",
  inputs: inputFields,
  outputs: [
    { id: "wetDayCount", label: "Wet day count", kind: "number" },
    {
      id: "totalWetDayPrecipitationMm",
      label: "Total wet day precipitation mm",
      kind: "number",
    },
    {
      id: "simpleDailyIntensityMmPerWetDay",
      label: "Simple daily intensity mm per wet day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyPrecipitationMm: value.dailyPrecipitationMm as readonly number[],
      callerWetDayThresholdMm: value.callerWetDayThresholdMm as number,
    }),
});
export const run = tool.execute;
export default tool;
