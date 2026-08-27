import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SeedVigorIndex2Input = {
  readonly germinationPercentNumber: number;
  readonly seedlingDryMassMg: number;
};

export type SeedVigorIndex2Output = {
  readonly vigorousSeedlingIndex: number;
};

export const seedVigorIndex2Example = {
  input: { germinationPercentNumber: 90, seedlingDryMassMg: 12 },
  output: { vigorousSeedlingIndex: 10.8 },
} satisfies ToolExample<SeedVigorIndex2Input, SeedVigorIndex2Output>;

export const seedVigorIndex2Tool = createSimpleTool({
  id: "biology/seed-vigor-index-2",
  title: "Vigorous Seedling Index",
  description:
    "Compute the vigorous seedling index as seedling dry mass in milligrams times the germination percentage divided by one hundred.",
  inputs: [
    {
      description: "Seedling dry mass in milligrams; must not be negative.",
      id: "seedlingDryMassMg",
      kind: "number",
      label: "Seedling dry mass",
      minimum: 0,
      unit: "mg",
    },
    {
      description: "Germination percentage between 0 and 100.",
      id: "germinationPercentNumber",
      kind: "number",
      label: "Germination percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Vigorous seedling index in percent-milligrams per hundred.",
      id: "vigorousSeedlingIndex",
      kind: "number",
      label: "Vigorous seedling index",
    },
  ],
  calculate: (input) => {
    const seedlingDryMassMg = input.seedlingDryMassMg as number;
    const germinationPercentNumber = input.germinationPercentNumber as number;
    return {
      vigorousSeedlingIndex:
        (seedlingDryMassMg * germinationPercentNumber) / 100,
    };
  },
});
export const runSeedVigorIndex2 = seedVigorIndex2Tool.execute;
export default seedVigorIndex2Tool;
