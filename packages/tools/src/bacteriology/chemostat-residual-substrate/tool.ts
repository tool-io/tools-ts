import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly dilutionRatePerHour: number;
  readonly maximumGrowthRatePerHour: number;
  readonly halfSaturationGramsPerLiter: number;
  readonly feedSubstrateGramsPerLiter: number;
}>;
export type Output = Readonly<{
  readonly residualSubstrateGramsPerLiter: number;
  readonly positiveBiomassSteadyStateFeasible: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.dilutionRatePerHour, "dilutionRatePerHour");
  positive(input.maximumGrowthRatePerHour, "maximumGrowthRatePerHour");
  positive(input.halfSaturationGramsPerLiter, "halfSaturationGramsPerLiter");
  nonnegative(input.feedSubstrateGramsPerLiter, "feedSubstrateGramsPerLiter");
  if (input.dilutionRatePerHour >= input.maximumGrowthRatePerHour)
    simpleError(
      "dilutionRatePerHour",
      "A finite positive-biomass Monod branch requires D below mu-max.",
    );
  const residualSubstrateGramsPerLiter =
    (input.dilutionRatePerHour * input.halfSaturationGramsPerLiter) /
    (input.maximumGrowthRatePerHour - input.dilutionRatePerHour);
  return {
    residualSubstrateGramsPerLiter,
    positiveBiomassSteadyStateFeasible:
      residualSubstrateGramsPerLiter < input.feedSubstrateGramsPerLiter,
  };
};
export const exampleInput = {
  dilutionRatePerHour: 0.2,
  maximumGrowthRatePerHour: 0.6,
  halfSaturationGramsPerLiter: 1,
  feedSubstrateGramsPerLiter: 5,
} satisfies Input;
export const exampleOutput = {
  residualSubstrateGramsPerLiter: 0.5,
  positiveBiomassSteadyStateFeasible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/chemostat-residual-substrate",
  title: "Chemostat Residual Substrate",
  description:
    "Solve the non-washout Monod chemostat branch and check whether the feed can sustain its residual substrate concentration.",
  inputs: [
    {
      id: "dilutionRatePerHour",
      label: "Dilution rate per hour",
      kind: "number",
    },
    {
      id: "maximumGrowthRatePerHour",
      label: "Maximum growth rate per hour",
      kind: "number",
    },
    {
      id: "halfSaturationGramsPerLiter",
      label: "Half saturation grams per liter",
      kind: "number",
    },
    {
      id: "feedSubstrateGramsPerLiter",
      label: "Feed substrate grams per liter",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "residualSubstrateGramsPerLiter",
      label: "Residual substrate grams per liter",
      kind: "number",
    },
    {
      id: "positiveBiomassSteadyStateFeasible",
      label: "Positive biomass steady state feasible",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      dilutionRatePerHour: value.dilutionRatePerHour as number,
      maximumGrowthRatePerHour: value.maximumGrowthRatePerHour as number,
      halfSaturationGramsPerLiter: value.halfSaturationGramsPerLiter as number,
      feedSubstrateGramsPerLiter: value.feedSubstrateGramsPerLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
