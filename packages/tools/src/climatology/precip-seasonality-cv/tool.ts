import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  mean,
  months,
} from "../shared.js";

export type Input = Readonly<{
  readonly monthlyPrecipitationMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly monthlyPrecipitationMeanMm: number;
  readonly populationMonthlyPrecipitationSdMm: number;
  readonly precipitationSeasonalityCvPercent: number;
}>;
const inputFields = [
  {
    id: "monthlyPrecipitationMm",
    label: "Monthly precipitation mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.monthlyPrecipitationMm.forEach((v) =>
    nonnegative(v, "monthlyPrecipitationMm"),
  );
  months(input.monthlyPrecipitationMm, "months");
  const monthlyPrecipitationMeanMm = positive(
      mean(input.monthlyPrecipitationMm),
      "meanPrecipitation",
    ),
    populationMonthlyPrecipitationSdMm = Math.sqrt(
      input.monthlyPrecipitationMm.reduce(
        (s, v) => s + (v - monthlyPrecipitationMeanMm) ** 2,
        0,
      ) / 12,
    );
  return {
    monthlyPrecipitationMeanMm,
    populationMonthlyPrecipitationSdMm,
    precipitationSeasonalityCvPercent:
      (100 * populationMonthlyPrecipitationSdMm) / monthlyPrecipitationMeanMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyPrecipitationMm: [0, 0, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20],
} satisfies Input;
export const exampleOutput = {
  monthlyPrecipitationMeanMm: 10,
  populationMonthlyPrecipitationSdMm: 10,
  precipitationSeasonalityCvPercent: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/precip-seasonality-cv",
  title: "Precipitation Seasonality CV",
  description:
    "Report measured twelve-month precipitation seasonality under population monthly SD, not sample SD or silently smoothed/+1 precipitation; zero mean leaves CV undefined.",
  inputs: inputFields,
  outputs: [
    {
      id: "monthlyPrecipitationMeanMm",
      label: "Monthly precipitation mean mm",
      kind: "number",
    },
    {
      id: "populationMonthlyPrecipitationSdMm",
      label: "Population monthly precipitation sd mm",
      kind: "number",
    },
    {
      id: "precipitationSeasonalityCvPercent",
      label: "Precipitation seasonality cv percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyPrecipitationMm: value.monthlyPrecipitationMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
