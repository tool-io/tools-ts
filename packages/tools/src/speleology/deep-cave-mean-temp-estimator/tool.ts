import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  positive,
  sum,
  weightedMean,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualFullYearSurfaceTemperatureKelvinMeans: readonly number[];
  readonly actualRepresentedDays: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFullYearSurfaceTemperatureKelvinMeans",
    label: "Actual full year surface temperature kelvin means",
    kind: "numberList",
  },
  {
    id: "actualRepresentedDays",
    label: "Actual represented days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualFullYearSurfaceTemperatureKelvinMeans.forEach((v) =>
    positive(v, "kelvin"),
  );
  input.actualRepresentedDays.forEach((v) => bounded(v, "days", 1, 366));
  if (![365, 366].includes(sum(input.actualRepresentedDays)))
    simpleError("annualcoverage", "Actual disjoint complete365/366dayyear.");
  return {
    observedAnnualDayWeightedSurfaceTemperatureKelvin: weightedMean(
      input.actualFullYearSurfaceTemperatureKelvinMeans,
      input.actualRepresentedDays,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFullYearSurfaceTemperatureKelvinMeans: [280, 290],
    actualRepresentedDays: [180, 185],
  },
  output: {
    result: {
      observedAnnualDayWeightedSurfaceTemperatureKelvin: 285.06849315068496,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/deep-cave-mean-temp-estimator",
  title: "Mean Annual Surface Temperature Deep Cave Estimator",
  description:
    "Actual complete365 or 366dayweighted mean surface temperature, conditional deep-cave baseline only. Not ventilation/geothermal/seasonal offset or guaranteed actual cave temperature.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
