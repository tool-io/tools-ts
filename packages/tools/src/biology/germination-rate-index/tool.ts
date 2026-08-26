import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GerminationRateIndexInput = {
  readonly day1Count: number;
  readonly day2Count: number;
  readonly seedsSownInt: number;
};

export type GerminationRateIndexOutput = {
  readonly germinationRateIndex: number;
};

export const germinationRateIndexExample = {
  input: { day1Count: 20, day2Count: 10, seedsSownInt: 50 },
  output: { germinationRateIndex: 50 },
} satisfies ToolExample<GerminationRateIndexInput, GerminationRateIndexOutput>;

export const germinationRateIndexTool = createSimpleTool({
  id: "biology/germination-rate-index",
  title: "Germination Rate Index",
  description:
    "Compute the germination rate index over two days as (day one count / 1 + day two count / 2) / seeds sown times 100, expressed in percent per day.",
  inputs: [
    {
      description: "Seeds germinated on day one; must not be negative.",
      id: "day1Count",
      kind: "integer",
      label: "Day one germinations",
      minimum: 0,
    },
    {
      description: "Seeds germinated on day two; must not be negative.",
      id: "day2Count",
      kind: "integer",
      label: "Day two germinations",
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
      description: "Germination rate index in percent per day.",
      id: "germinationRateIndex",
      kind: "number",
      label: "Germination rate index",
      unit: "%/day",
    },
  ],
  calculate: (input) => {
    const day1Count = input.day1Count as number;
    const day2Count = input.day2Count as number;
    const seedsSownInt = input.seedsSownInt as number;
    if (day1Count + day2Count > seedsSownInt)
      simpleError(
        "day2Count",
        "Cumulative germinations must not exceed seeds sown.",
        "invalid_counts",
      );
    return {
      germinationRateIndex:
        ((day1Count / 1 + day2Count / 2) / seedsSownInt) * 100,
    };
  },
});
export const runGerminationRateIndex = germinationRateIndexTool.execute;
export default germinationRateIndexTool;
