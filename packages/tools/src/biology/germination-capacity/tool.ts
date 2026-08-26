import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GerminationCapacityInput = {
  readonly seedsSownInt: number;
  readonly totalGerminatedInt: number;
};

export type GerminationCapacityOutput = {
  readonly germinationCapacityPercent: number;
};

export const germinationCapacityExample = {
  input: { seedsSownInt: 50, totalGerminatedInt: 45 },
  output: { germinationCapacityPercent: 90 },
} satisfies ToolExample<GerminationCapacityInput, GerminationCapacityOutput>;

export const germinationCapacityTool = createSimpleTool({
  id: "biology/germination-capacity",
  title: "Germination Capacity %",
  description:
    "Compute germination capacity as the total seeds germinated over the whole assay divided by the seeds sown times one hundred.",
  inputs: [
    {
      description: "Number of seeds sown; must be at least one.",
      id: "seedsSownInt",
      kind: "integer",
      label: "Seeds sown",
      minimum: 1,
    },
    {
      description:
        "Total seeds germinated by the end of the assay; must not exceed seeds sown.",
      id: "totalGerminatedInt",
      kind: "integer",
      label: "Total germinated",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Germination capacity percentage between 0 and 100.",
      id: "germinationCapacityPercent",
      kind: "number",
      label: "Germination capacity",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const seedsSownInt = input.seedsSownInt as number;
    const totalGerminatedInt = input.totalGerminatedInt as number;
    if (!(totalGerminatedInt <= seedsSownInt))
      simpleError(
        "totalGerminatedInt",
        "The total germinated must not exceed the seeds sown.",
        "invalid_counts",
      );
    return {
      germinationCapacityPercent: (totalGerminatedInt / seedsSownInt) * 100,
    };
  },
});
export const runGerminationCapacity = germinationCapacityTool.execute;
export default germinationCapacityTool;
