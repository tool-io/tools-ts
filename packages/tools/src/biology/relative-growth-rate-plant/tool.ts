import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelativeGrowthRatePlantInput = {
  readonly daysElapsed: number;
  readonly finalMassG: number;
  readonly initialMassG: number;
};

export type RelativeGrowthRatePlantOutput = {
  readonly rgrPerDay: number;
};

export const relativeGrowthRatePlantExample = {
  input: { daysElapsed: 5, finalMassG: 20, initialMassG: 10 },
  output: { rgrPerDay: 0.138629436111989 },
} satisfies ToolExample<
  RelativeGrowthRatePlantInput,
  RelativeGrowthRatePlantOutput
>;

export const relativeGrowthRatePlantTool = createSimpleTool({
  id: "biology/relative-growth-rate-plant",
  title: "Relative Growth Rate",
  description:
    "Compute plant relative growth rate RGR per day as (ln W2 - ln W1) / elapsed days from dry masses measured at two times.",
  inputs: [
    {
      id: "daysElapsed",
      kind: "number",
      label: "Elapsed time",
      unit: "days",
    },
    {
      id: "finalMassG",
      kind: "number",
      label: "Final dry mass",
      unit: "g",
    },
    {
      id: "initialMassG",
      kind: "number",
      label: "Initial dry mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "rgrPerDay",
      kind: "number",
      label: "Relative growth rate",
      unit: "1/day",
    },
  ],
  calculate: (input) => {
    const initialMassG = input.initialMassG as number;
    const finalMassG = input.finalMassG as number;
    const daysElapsed = input.daysElapsed as number;
    if (!(initialMassG > 0))
      simpleError(
        "initialMassG",
        "The initial dry mass must be greater than zero.",
      );
    if (!(finalMassG > 0))
      simpleError(
        "finalMassG",
        "The final dry mass must be greater than zero.",
      );
    if (!(daysElapsed > 0))
      simpleError(
        "daysElapsed",
        "The elapsed time must be greater than zero.",
        "degenerate_days",
      );
    return {
      rgrPerDay: (Math.log(finalMassG) - Math.log(initialMassG)) / daysElapsed,
    };
  },
});
export const runRelativeGrowthRatePlant = relativeGrowthRatePlantTool.execute;
export default relativeGrowthRatePlantTool;
