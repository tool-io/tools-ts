import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GerminationEnergyInput = {
  readonly germinatedByPeakDayInt: number;
  readonly seedsSownInt: number;
};

export type GerminationEnergyOutput = {
  readonly germinationEnergyPercent: number;
};

export const germinationEnergyExample = {
  input: { germinatedByPeakDayInt: 18, seedsSownInt: 50 },
  output: { germinationEnergyPercent: 36 },
} satisfies ToolExample<GerminationEnergyInput, GerminationEnergyOutput>;

export const germinationEnergyTool = createSimpleTool({
  id: "biology/germination-energy",
  title: "Germination Energy %",
  description:
    "Compute germination energy as the seeds germinated by the peak day divided by the seeds sown times one hundred; the peak day is the day on which the daily germination count is highest and only counts up to that day are included.",
  inputs: [
    {
      description:
        "Seeds germinated by the peak day of the assay; must not exceed seeds sown.",
      id: "germinatedByPeakDayInt",
      kind: "integer",
      label: "Germinated by peak day",
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
      description: "Germination energy percentage between 0 and 100.",
      id: "germinationEnergyPercent",
      kind: "number",
      label: "Germination energy",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const germinatedByPeakDayInt = input.germinatedByPeakDayInt as number;
    const seedsSownInt = input.seedsSownInt as number;
    if (!(germinatedByPeakDayInt <= seedsSownInt))
      simpleError(
        "germinatedByPeakDayInt",
        "The seeds germinated by the peak day must not exceed the seeds sown.",
        "invalid_counts",
      );
    return {
      germinationEnergyPercent: (germinatedByPeakDayInt / seedsSownInt) * 100,
    };
  },
});
export const runGerminationEnergy = germinationEnergyTool.execute;
export default germinationEnergyTool;
