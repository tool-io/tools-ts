import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GerminationPercentageInput = {
  readonly germinatedSeedsInt: number;
  readonly seedsSownInt: number;
};

export type GerminationPercentageOutput = {
  readonly germinationPercent: number;
};

export const germinationPercentageExample = {
  input: { germinatedSeedsInt: 45, seedsSownInt: 50 },
  output: { germinationPercent: 90 },
} satisfies ToolExample<
  GerminationPercentageInput,
  GerminationPercentageOutput
>;

export const germinationPercentageTool = createSimpleTool({
  id: "biology/germination-percentage",
  title: "Germination Percentage",
  description:
    "Compute germination percentage as germinated seeds divided by seeds sown times one hundred.",
  inputs: [
    {
      description:
        "Number of seeds that germinated; must not exceed seeds sown.",
      id: "germinatedSeedsInt",
      kind: "integer",
      label: "Germinated seeds",
      minimum: 0,
    },
    {
      description: "Number of seeds sown; must be at least one.",
      id: "seedsSownInt",
      kind: "integer",
      label: "Seeds sown",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Germination percentage between 0 and 100.",
      id: "germinationPercent",
      kind: "number",
      label: "Germination",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const germinatedSeedsInt = input.germinatedSeedsInt as number;
    const seedsSownInt = input.seedsSownInt as number;
    if (!(germinatedSeedsInt <= seedsSownInt))
      simpleError(
        "germinatedSeedsInt",
        "The germinated seeds must not exceed the seeds sown.",
        "invalid_counts",
      );
    return { germinationPercent: (germinatedSeedsInt / seedsSownInt) * 100 };
  },
});
export const runGerminationPercentage = germinationPercentageTool.execute;
export default germinationPercentageTool;
