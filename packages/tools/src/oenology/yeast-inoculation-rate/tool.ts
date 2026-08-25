import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type YeastInoculationRateInput = {
  readonly volumeHectoliters: number;
  readonly yeastGrams: number;
};

export type YeastInoculationRateOutput = {
  readonly gramsPerHectoliter: number;
};

export const yeastInoculationRateExample = {
  input: {
    volumeHectoliters: 20,
    yeastGrams: 250,
  },
  output: {
    gramsPerHectoliter: 12.5,
  },
} satisfies ToolExample<YeastInoculationRateInput, YeastInoculationRateOutput>;

export const calculateYeastInoculationRate = (
  input: YeastInoculationRateInput,
): YeastInoculationRateOutput => {
  if (input.volumeHectoliters <= 0)
    simpleError(
      "volumeHectoliters",
      "The must volume must be positive.",
      "invalid_value",
    );
  return {
    gramsPerHectoliter: roundStatistic(
      input.yeastGrams / input.volumeHectoliters,
    ),
  };
};

export const yeastInoculationRateTool = createSimpleTool({
  calculate: (input) =>
    calculateYeastInoculationRate(
      input as unknown as YeastInoculationRateInput,
    ),
  description:
    "Express the pitched dry yeast mass as an inoculation rate in grams per hectoliter of must.",
  id: "oenology/yeast-inoculation-rate",
  inputs: [
    {
      description: "Must volume in hectoliters.",
      id: "volumeHectoliters",
      kind: "number",
      label: "Must volume",
      minimum: 0,
      unit: "hL",
    },
    {
      description: "Dry yeast mass to pitch.",
      id: "yeastGrams",
      kind: "number",
      label: "Yeast",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Inoculation rate for the lot.",
      id: "gramsPerHectoliter",
      kind: "number",
      label: "Inoculation rate",
      unit: "g/hL",
    },
  ],
  title: "Yeast Inoculation Rate g/hL Calculator",
});
export const runYeastInoculationRate = yeastInoculationRateTool.execute;
export default yeastInoculationRateTool;
