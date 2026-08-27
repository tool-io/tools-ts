import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SeedlingLengthVigorInput = {
  readonly rootLengthCm: number;
  readonly shootLengthCm: number;
};

export type SeedlingLengthVigorOutput = {
  readonly seedlingTotalLengthCm: number;
};

export const seedlingLengthVigorExample = {
  input: { rootLengthCm: 6.5, shootLengthCm: 7.5 },
  output: { seedlingTotalLengthCm: 14 },
} satisfies ToolExample<SeedlingLengthVigorInput, SeedlingLengthVigorOutput>;

export const seedlingLengthVigorTool = createSimpleTool({
  id: "biology/seedling-length-vigor",
  title: "Seedling Length Vigor",
  description:
    "Compute the seedling length vigor as the shoot length plus the root length in centimeters.",
  inputs: [
    {
      description: "Shoot length in centimeters; must not be negative.",
      id: "shootLengthCm",
      kind: "number",
      label: "Shoot length",
      minimum: 0,
      unit: "cm",
    },
    {
      description: "Root length in centimeters; must not be negative.",
      id: "rootLengthCm",
      kind: "number",
      label: "Root length",
      minimum: 0,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description: "Total seedling length (shoot plus root) in centimeters.",
      id: "seedlingTotalLengthCm",
      kind: "number",
      label: "Seedling total length",
      unit: "cm",
    },
  ],
  calculate: (input) => {
    const shootLengthCm = input.shootLengthCm as number;
    const rootLengthCm = input.rootLengthCm as number;
    return { seedlingTotalLengthCm: shootLengthCm + rootLengthCm };
  },
});
export const runSeedlingLengthVigor = seedlingLengthVigorTool.execute;
export default seedlingLengthVigorTool;
