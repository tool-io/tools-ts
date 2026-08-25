import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type KmbsGramsPpmInput = {
  readonly kmbsSo2ContentPercent: number;
  readonly targetIncreaseMgPerL: number;
  readonly volumeLiters: number;
};

export type KmbsGramsPpmOutput = {
  readonly kmbsGrams: number;
};

export const kmbsGramsPpmExample = {
  input: {
    kmbsSo2ContentPercent: 57,
    targetIncreaseMgPerL: 30,
    volumeLiters: 200,
  },
  output: {
    kmbsGrams: 10.5263157895,
  },
} satisfies ToolExample<KmbsGramsPpmInput, KmbsGramsPpmOutput>;

export const calculateKmbsGrams = (
  input: KmbsGramsPpmInput,
): KmbsGramsPpmOutput => {
  const so2Fraction = input.kmbsSo2ContentPercent / 100;
  if (so2Fraction <= 0)
    simpleError(
      "kmbsSo2ContentPercent",
      "The SO2 content of the KMBS must be positive.",
      "invalid_value",
    );
  const so2Milligrams = input.targetIncreaseMgPerL * input.volumeLiters;
  return {
    kmbsGrams: roundStatistic(so2Milligrams / so2Fraction / 1000),
  };
};

export const kmbsGramsPpmTool = createSimpleTool({
  calculate: (input) =>
    calculateKmbsGrams(input as unknown as KmbsGramsPpmInput),
  description:
    "Calculate theoretical potassium-metabisulfite mass for a requested SO2 addition from the product's stated SO2 content; binding means the measured free-SO2 increase may be lower.",
  id: "oenology/kmbs-grams-ppm",
  inputs: [
    {
      description: "Sulfur dioxide mass fraction stated for the KMBS product.",
      id: "kmbsSo2ContentPercent",
      kind: "number",
      label: "SO2 content",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Desired theoretical SO2 addition.",
      id: "targetIncreaseMgPerL",
      kind: "number",
      label: "Target increase",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Volume of wine or must to treat.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Potassium metabisulfite to weigh out.",
      id: "kmbsGrams",
      kind: "number",
      label: "KMBS",
      unit: "g",
    },
  ],
  title: "KMBS Grams for Target ppm Calculator",
});
export const runKmbsGramsPpm = kmbsGramsPpmTool.execute;
export default kmbsGramsPpmTool;
