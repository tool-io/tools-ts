import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellGrowthRateExample = {
  input: { elapsedHours: 2, finalCount: 200, initialCount: 100 },
} satisfies ToolExample<{
  readonly elapsedHours: number;
  readonly finalCount: number;
  readonly initialCount: number;
}>;

export const cellGrowthRateTool = createSimpleTool({
  id: "biology/cell-growth-rate",
  title: "Specific Growth Rate",
  description:
    "Calculate the specific growth rate in inverse hours from two counts.",
  inputs: [
    { id: "initialCount", label: "Initial count", kind: "number" },
    { id: "finalCount", label: "Final count", kind: "number" },
    { id: "elapsedHours", label: "Elapsed time", kind: "number", unit: "h" },
  ],
  outputs: [
    {
      id: "growthRatePerHour",
      label: "Specific growth rate",
      kind: "number",
      unit: "1/h",
    },
  ],
  calculate: (input) => {
    const initialCount = input.initialCount as number;
    const finalCount = input.finalCount as number;
    const elapsedHours = input.elapsedHours as number;
    if (initialCount <= 0 || finalCount <= 0)
      simpleError(
        "initialCount",
        "Cell counts must be greater than zero.",
        "invalid_counts",
      );
    if (finalCount <= initialCount)
      simpleError(
        "finalCount",
        "Final count must exceed the initial count.",
        "invalid_growth",
      );
    if (elapsedHours <= 0)
      simpleError(
        "elapsedHours",
        "Elapsed hours must be greater than zero.",
        "invalid_value",
      );
    return {
      growthRatePerHour: Math.log(finalCount / initialCount) / elapsedHours,
    };
  },
});
export const runCellGrowthRate = cellGrowthRateTool.execute;
export default cellGrowthRateTool;
