import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeedlingVigorIndexInput = {
  readonly germinationPercentNumber: number;
  readonly seedlingLengthCm: number;
};

export type SeedlingVigorIndexOutput = {
  readonly seedlingVigorIndex: number;
};

export const seedlingVigorIndexExample = {
  input: { germinationPercentNumber: 90, seedlingLengthCm: 10 },
  output: { seedlingVigorIndex: 900 },
} satisfies ToolExample<SeedlingVigorIndexInput, SeedlingVigorIndexOutput>;

export const seedlingVigorIndexTool = createSimpleTool({
  id: "biology/seedling-vigor-index",
  title: "Seedling Vigor Index",
  description:
    "Compute the documented seedling vigor index as germination percent times seedling length in centimeters.",
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
      description: "Seedling vigor index in percent-centimeters.",
      id: "seedlingVigorIndex",
      kind: "number",
      label: "Seedling vigor index",
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
    return { seedlingVigorIndex: germinationPercentNumber * seedlingLengthCm };
  },
});
export const runSeedlingVigorIndex = seedlingVigorIndexTool.execute;
export default seedlingVigorIndexTool;
