import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeedVigorIndexInput = {
  readonly germinationPercentNumber: number;
  readonly seedlingLengthCm: number;
};

export type SeedVigorIndexOutput = {
  readonly vigorIndex: number;
};

export const seedVigorIndexExample = {
  input: { germinationPercentNumber: 90, seedlingLengthCm: 10 },
  output: { vigorIndex: 9 },
} satisfies ToolExample<SeedVigorIndexInput, SeedVigorIndexOutput>;

export const seedVigorIndexTool = createSimpleTool({
  id: "biology/seed-vigor-index",
  title: "Seed Vigor Index",
  description:
    "Compute the seed vigor index as germination percent times seedling length in centimeters divided by one hundred.",
  inputs: [
    {
      description: "Germination percentage between 0 and 100.",
      id: "germinationPercentNumber",
      kind: "number",
      label: "Germination percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Seedling length in centimeters; must be greater than zero.",
      id: "seedlingLengthCm",
      kind: "number",
      label: "Seedling length",
      unit: "cm",
    },
  ],
  outputs: [
    {
      description: "Seed vigor index in percent-centimeters per hundred.",
      id: "vigorIndex",
      kind: "number",
      label: "Vigor index",
    },
  ],
  calculate: (input) => {
    const germinationPercentNumber = input.germinationPercentNumber as number;
    const seedlingLengthCm = input.seedlingLengthCm as number;
    if (!(seedlingLengthCm > 0))
      simpleError(
        "seedlingLengthCm",
        "The seedling length must be greater than zero.",
      );
    return {
      vigorIndex: (germinationPercentNumber * seedlingLengthCm) / 100,
    };
  },
});
export const runSeedVigorIndex = seedVigorIndexTool.execute;
export default seedVigorIndexTool;
