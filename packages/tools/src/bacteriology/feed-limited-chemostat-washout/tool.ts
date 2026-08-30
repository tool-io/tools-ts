import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly feedLitersPerHour: number;
  readonly cultureVolumeLiters: number;
  readonly maximumGrowthRatePerHour: number;
  readonly feedSubstrateGramsPerLiter: number;
  readonly halfSaturationGramsPerLiter: number;
}>;
export type Output = Readonly<{
  readonly dilutionRatePerHour: number;
  readonly feedLimitedGrowthRatePerHour: number;
  readonly washoutAtOrAboveBoundary: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.feedLitersPerHour, "feedLitersPerHour");
  positive(input.cultureVolumeLiters, "cultureVolumeLiters");
  positive(input.maximumGrowthRatePerHour, "maximumGrowthRatePerHour");
  nonnegative(input.feedSubstrateGramsPerLiter, "feedSubstrateGramsPerLiter");
  positive(input.halfSaturationGramsPerLiter, "halfSaturationGramsPerLiter");
  const dilutionRatePerHour =
      input.feedLitersPerHour / input.cultureVolumeLiters,
    feedLimitedGrowthRatePerHour =
      (input.maximumGrowthRatePerHour * input.feedSubstrateGramsPerLiter) /
      (input.halfSaturationGramsPerLiter + input.feedSubstrateGramsPerLiter);
  return {
    dilutionRatePerHour,
    feedLimitedGrowthRatePerHour,
    washoutAtOrAboveBoundary:
      dilutionRatePerHour >= feedLimitedGrowthRatePerHour,
  };
};
export const exampleInput = {
  feedLitersPerHour: 2,
  cultureVolumeLiters: 10,
  maximumGrowthRatePerHour: 0.5,
  feedSubstrateGramsPerLiter: 1,
  halfSaturationGramsPerLiter: 1,
} satisfies Input;
export const exampleOutput = {
  dilutionRatePerHour: 0.2,
  feedLimitedGrowthRatePerHour: 0.25,
  washoutAtOrAboveBoundary: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/feed-limited-chemostat-washout",
  title: "Feed Limited Chemostat Washout",
  description:
    "Screen the feed-limited Monod chemostat washout boundary from flow, volume, and feed substrate; equality is the zero-biomass boundary.",
  inputs: [
    {
      id: "feedLitersPerHour",
      label: "Feed liters per hour",
      kind: "number",
      minimum: 0,
    },
    {
      id: "cultureVolumeLiters",
      label: "Culture volume liters",
      kind: "number",
    },
    {
      id: "maximumGrowthRatePerHour",
      label: "Maximum growth rate per hour",
      kind: "number",
    },
    {
      id: "feedSubstrateGramsPerLiter",
      label: "Feed substrate grams per liter",
      kind: "number",
      minimum: 0,
    },
    {
      id: "halfSaturationGramsPerLiter",
      label: "Half saturation grams per liter",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "dilutionRatePerHour",
      label: "Dilution rate per hour",
      kind: "number",
    },
    {
      id: "feedLimitedGrowthRatePerHour",
      label: "Feed limited growth rate per hour",
      kind: "number",
    },
    {
      id: "washoutAtOrAboveBoundary",
      label: "Washout at or above boundary",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      feedLitersPerHour: value.feedLitersPerHour as number,
      cultureVolumeLiters: value.cultureVolumeLiters as number,
      maximumGrowthRatePerHour: value.maximumGrowthRatePerHour as number,
      feedSubstrateGramsPerLiter: value.feedSubstrateGramsPerLiter as number,
      halfSaturationGramsPerLiter: value.halfSaturationGramsPerLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
